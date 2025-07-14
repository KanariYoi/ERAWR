from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, ProfileSerializer, OrderSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, Order
from .models import Service, AddOn, Bundle
from .serializers import ServiceSerializer, AddOnSerializer, BundleSerializer
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime
import traceback

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        token['username'] = user.username
        return token

class LoginView(APIView):
    def post(self, request):
        identifier = request.data.get('username')  # can be username or email
        password = request.data.get('password')
        user = authenticate(username=identifier, password=password)
        if not user:
            # Try email
            try:
                from django.contrib.auth.models import User
                user_obj = User.objects.get(email=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Create your views here.
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            profile = user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=user)
        
        return Response({
            'username': user.username,
            'first_name': user.first_name or '',
            'last_name': user.last_name or '',
            'email': user.email,
            'mobile_number': profile.mobile_number or '',
            'most_order_used': profile.most_order_used or '',
        })
    
    def put(self, request):
        user = request.user
        try:
            profile = user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=user)
        
        # Update user fields
        if 'username' in request.data:
            user.username = request.data['username']
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'email' in request.data:
            user.email = request.data['email']
        user.save()
        
        # Update profile fields
        if 'mobile_number' in request.data:
            profile.mobile_number = request.data['mobile_number']
        if 'most_order_used' in request.data:
            profile.most_order_used = request.data['most_order_used']
        profile.save()
        
        return Response({
            'username': user.username,
            'first_name': user.first_name or '',
            'last_name': user.last_name or '',
            'email': user.email,
            'mobile_number': profile.mobile_number or '',
            'most_order_used': profile.most_order_used or '',
        }, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not user.check_password(old_password):
            return Response({'detail': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class AddOnListView(generics.ListAPIView):
    queryset = AddOn.objects.all()
    serializer_class = AddOnSerializer

class BundleListView(generics.ListAPIView):
    queryset = Bundle.objects.all()
    serializer_class = BundleSerializer

class OrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        orders = Order.objects.filter(user=user).order_by('-created_at')
        data = []
        for order in orders:
            data.append({
                'id': order.id,
                'created_at': order.created_at.isoformat(),
                'first_name': order.first_name,
                'last_name': order.last_name,
                'email': order.email,
                'payment_method': order.payment_method,
                'dropoff_date': str(order.dropoff_date),
                'dropoff_time': str(order.dropoff_time),
                'order_summary': order.order_summary,
                'total_amount': float(order.total_amount),
            })
        return Response(data)
    
    def post(self, request):
        try:
            # Get user data
            user = request.user
            
            # Create order
            order_data = {
                'user': user,
                'first_name': request.data.get('first_name'),
                'last_name': request.data.get('last_name'),
                'email': request.data.get('email'),
                'payment_method': request.data.get('payment_method'),
                'dropoff_date': request.data.get('dropoff_date'),
                'dropoff_time': request.data.get('dropoff_time'),
                'order_summary': request.data.get('order_summary'),
                'total_amount': request.data.get('total_amount'),
            }
            
            order = Order.objects.create(**order_data)
            
            # Send email to user
            self.send_order_email(order)
            # Send admin notification
            self.send_admin_notification(order)
            
            return Response({
                'message': 'Order placed successfully! Check your email for confirmation.',
                'order_id': order.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print('Order placement error:', e)
            print('Request data:', request.data)
            traceback.print_exc()
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def send_order_email(self, order):
        # Convert dropoff_date and dropoff_time to date/time objects if they are strings
        dropoff_date = order.dropoff_date
        dropoff_time = order.dropoff_time
        if isinstance(dropoff_date, str):
            dropoff_date = datetime.strptime(dropoff_date, "%Y-%m-%d").date()
        if isinstance(dropoff_time, str):
            dropoff_time = datetime.strptime(dropoff_time, "%H:%M").time()
        time_str = dropoff_time.strftime('%I:%M %p')
        date_str = dropoff_date.strftime('%B %d, %Y')
        
        # Create email content
        subject = f"Order Confirmation - Kick N' Klean"
        
        message = f"""
Dear {order.first_name} {order.last_name},

Thank you for your order with Kick N' Klean! Your order has been confirmed.

ORDER DETAILS:
Order ID: {order.id}
Date: {order.created_at.strftime('%B %d, %Y at %I:%M %p')}

CUSTOMER INFORMATION:
Name: {order.first_name} {order.last_name}
Email: {order.email}

PAYMENT METHOD:
{order.payment_method}

DROP-OFF INFORMATION:
Date: {date_str}
Time: {time_str}
Address: 157 T&D Village, Tuktukan, Taguig City

ORDER SUMMARY:
{order.order_summary}

TOTAL AMOUNT: ₱{order.total_amount}

Please bring your shoes to our location at the scheduled time. We look forward to serving you!

Best regards,
Kick N' Klean Team
        """
        
        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.email],
            fail_silently=False,
        )

    def send_admin_notification(self, order):
        from django.conf import settings
        dropoff_date = order.dropoff_date
        dropoff_time = order.dropoff_time
        if isinstance(dropoff_date, str):
            dropoff_date = datetime.strptime(dropoff_date, "%Y-%m-%d").date()
        if isinstance(dropoff_time, str):
            dropoff_time = datetime.strptime(dropoff_time, "%H:%M").time()
        time_str = dropoff_time.strftime('%I:%M %p')
        date_str = dropoff_date.strftime('%B %d, %Y')
        subject = f"[ADMIN] New Order Received - {order.first_name} {order.last_name} (ID: {order.id})"
        message = f"""
A new order has been placed on Kick N' Klean.

ORDER DETAILS:
Order ID: {order.id}
Date: {order.created_at.strftime('%B %d, %Y at %I:%M %p')}

CUSTOMER INFORMATION:
Name: {order.first_name} {order.last_name}
Email: {order.email}

PAYMENT METHOD:
{order.payment_method}

DROP-OFF INFORMATION:
Date: {date_str}
Time: {time_str}
Address: 157 T&D Village, Tuktukan, Taguig City

ORDER SUMMARY:
{order.order_summary}

TOTAL AMOUNT: ₱{order.total_amount}
"""
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
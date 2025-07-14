from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, Service, AddOn, Bundle, Order

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')
    mobile_number = serializers.CharField(required=False, allow_blank=True)
    most_order_used = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = UserProfile
        fields = ('username', 'first_name', 'last_name', 'email', 'mobile_number', 'most_order_used')
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        # Update user fields
        if 'username' in user_data:
            user.username = user_data['username']
        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            user.last_name = user_data['last_name']
        if 'email' in user_data:
            user.email = user_data['email']
        user.save()
        
        # Update profile fields
        if 'mobile_number' in validated_data:
            instance.mobile_number = validated_data['mobile_number']
        if 'most_order_used' in validated_data:
            instance.most_order_used = validated_data['most_order_used']
        instance.save()
        
        return instance

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'description']

class AddOnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        fields = ['id', 'name', 'price', 'description']

class BundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bundle
        fields = ['id', 'name', 'price', 'description']
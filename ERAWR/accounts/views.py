from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        })

    def put(self, request):
        user = request.user
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        user.save()
        return Response({
            'username': user.username,
            'email': user.email,
        }, status=status.HTTP_200_OK) 
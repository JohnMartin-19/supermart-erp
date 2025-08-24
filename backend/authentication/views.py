from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterAPIView(APIView):
    def post(self,request):
        
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            password = serializer.validated_data.pop('password')
            user = User.objects.create_user(password=password, **serializer.validated_data)
            user.save()
            return Response(UserSerializer(user).data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class LoginAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
        
        
    
class LogoutAPIView(APIView):
    def post(self, request) :
        try:
             refresh_token = request.data['refresh_token']
             token = RefreshToken(refresh_token)
             if token:
                token.blacklist()
                return Response({"message": "Successfully logged out."},status = status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)}, status = status.HTTP_BAD_REQUEST)
    
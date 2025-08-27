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
            validated_data = serializer.validated_data
            try:
                company_name = validated_data.get('company_name')
                company_size = validated_data.get('company_size')
                phone_number = validated_data.get('phone_number')
                
                if Tenant.objects.filter(name = company_name).exists():
                    return Response({'A tenant with the company name exists'}, status=status.HTTP_400_BAD_REQUEST)
                
                #create a tenant instance
                tenant_name_slug = company_name.replace(" ", "").lower()
                tenant = Tenant.objects.create(
                    name = company_name,
                    schema_name = tenant_name_slug,
                    email = validated_data.get("email"),
                    contact_person = validated_data.get('contact_person'),
                    phone_number = phone_number
                    
                )
                
                #create a user
                password = serializer.validated_data.pop('password')
                user = User.objects.create_user(password=password,tenant = tenant **serializer.validated_data)
                user.save()
                return Response(UserSerializer(user).data, status = status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    
class LoginAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
        
        
    
class LogoutAPIView(APIView):
    def post(self, request) :
        try:
             refresh_token = request.data['refresh']
             token = RefreshToken(refresh_token)
             if token:
                token.blacklist()
                return Response({"message": "Successfully logged out."},status = status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)}, status = status.HTTP_400_BAD_REQUEST)
    
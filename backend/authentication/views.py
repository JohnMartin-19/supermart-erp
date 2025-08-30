from django.shortcuts import render
from django.shortcuts import render
from tenants.models import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db import transaction
from django.utils.text import slugify
from django_tenants.utils import schema_context

class RegisterAPIView(APIView):
    def post(self, request):
        with transaction.atomic():
            company_name = request.data.get("company_name")
            domain_url = request.data.get("domain_url")
            email = request.data.get("email")
            phone_number = request.data.get("phone_number")
            password = request.data.get('password')

            with schema_context("public"):
                tenant = Tenant.objects.create(
                    name=company_name,
                    schema_name=company_name.lower(),
                    paid_until="2026-01-01",
                    on_trial=True,
                )
                Domain.objects.create(
                    domain=f"{company_name.lower()}.localhost",
                    tenant=tenant,
                    is_primary=True
                )

              
                user = User.objects.create_user(
                    username=email, 
                    email=email, 
                    password=password,
                    tenant=tenant
                )
                tenant.owner = user
                tenant.save()

            return Response(
                {"message": f"Tenant {company_name} and user {email} created successfully"},
                status=status.HTTP_201_CREATED
            )

    
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
    
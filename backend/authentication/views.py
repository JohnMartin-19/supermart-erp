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
from tenants.serializers import *
from tenants.models import *
class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data
        print("DATATAAT:", data)
        with transaction.atomic():
            company_name = request.data.get("company_name")
            domain_url = request.data.get("domain_url")
            email = request.data.get("email")
            phone_number = request.data.get("phone_number")
            password = request.data.get('password')
            username = request.data.get("username")
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')

            
            schema_name = company_name.lower().replace(" ", "")
            tenant_domain = f"{schema_name}.localhost"
            with schema_context("public"):
                tenant = Tenant.objects.create(
                    name=company_name,
                    schema_name=schema_name,
                    paid_until="2026-01-01",
                    on_trial=True,
                )
                Domain.objects.create(
                    domain=f"{company_name.lower()}.localhost",
                    tenant=tenant,
                    is_primary=True
                )

                with schema_context(tenant.schema_name):
                    
                    user = User.objects.create_user(
                        username=username, 
                        email=email, 
                        password=password,
                        tenant=tenant,
                        phone_number = phone_number,
                        first_name = first_name,
                        last_name = last_name,
                        company_name = company_name,
                        domain = tenant_domain
                        
                    )
                    ActivityLogs.objects.create(
                        tenant=request.user.tenant,
                        action_type='customer_added',
                        message=f'Your account was created and set up gracefully! "{user.username}" added.'
            )
                with schema_context("public"):
                        tenant.owner = user
                        tenant.save()
                
            return Response(
                {"message": f"Tenant {company_name} and user {email} created successfully", "tenant_domain": tenant_domain},
                
                status=status.HTTP_201_CREATED
            )

    
class LoginAPIView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
 
        response = super().post(request, *args, **kwargs)

        tenant_domain = None  

        if user.tenant_id:
            # 3. Switch to the 'public' schema to query for the domain
            with schema_context('public'):
                try:
                    # Use the tenant_id to get the domain from the public schema
                    domain = Domain.objects.get(tenant_id=user.tenant_id, is_primary=True)
                    tenant_domain = domain.domain
                except Domain.DoesNotExist:
                    pass

        # 4. Add the retrieved domain to the response
        response.data['tenant_domain'] = tenant_domain
        return response
    
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
    
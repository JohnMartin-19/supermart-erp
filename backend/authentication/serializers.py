from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import connection


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id',
                  "username",
                  "first_name",
            "last_name",
            "email",
            "phone_number",
            "company_name",
            "company_size",
            "password",
            ]
        
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['tenant_schema'] = connection.schema_name

        return token
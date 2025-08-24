from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import connection


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(required=True) # Ensure company name is required
    company_size = serializers.CharField(required=False)
    phone_number = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'phone_number', 'company_name', 'company_size')
        read_only_fields = ('id',)

    def create(self, validated_data):
        validated_data.pop('company_name')
        validated_data.pop('company_size')
        validated_data.pop('phone_number')
        user = User.objects.create_user(**validated_data)
        return user       
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['tenant_schema'] = connection.schema_name

        return token
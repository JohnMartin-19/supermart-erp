from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import connection


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(required=True)
    company_size = serializers.CharField(required=False)
    phone_number = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = (
            'id', 
            'username', 
            'email', 
            'password',
            'first_name',
            'last_name',
            'phone_number',
            'company_name',
            'company_size',
        )
        read_only_fields = ('id',)

    def create(self, validated_data):
        password = validated_data.pop("password")  
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
 
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['tenant_id'] = user.tenant_id
        token['company_name'] = getattr(user, 'company_name',None)
        token ['phone_number'] = getattr(user, 'phone_number', None)
        token['tenant_schema'] = connection.schema_name

        return token
    
    # def validate(self, attrs):
    #     data = super().validate(attrs)
    #     data.update({
    #         'username': self.user.username,
    #         'company_name': getattr(self.user, "company_name", None),
    #         'phone_number': getattr(self.user, "phone_number", None),
    #     })
    #     return data
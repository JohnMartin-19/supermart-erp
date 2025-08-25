from rest_framework import serializers
from .models import *


class CustomerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Customer
        fields = ['id','full_name','email','phone_number','address','membership_tier',
                  'member_since','last_visit','updated_at','tenant','is_active']
        read_only_fields = ['tenant']
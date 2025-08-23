from rest_framework import serializers
from .models import *


class SuppliersSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Supplier
        fields = ['id','company_name','contact_person','phone_number','email','category','address','payment_terms',
                  'credit_limit','is_active','tenant']
        read_only_fields = ['tenant','is_active']
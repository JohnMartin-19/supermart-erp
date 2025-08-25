from rest_framework import serializers
from .models import *


class SuppliersSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Supplier
        fields = ['id','company_name','contact_person','phone_number','email','category','address','payment_terms',
                  'credit_limit','is_active','tenant','city']
        read_only_fields = ['tenant','is_active']
        
class PurchaseOrderSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PurchaseOrder
        fields = ['id','supplier','delivery_date','notes','status','created_at','updated_at','tenant', 'product','quantity']
        read_only_fields = ['tenant']
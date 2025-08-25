from rest_framework import serializers
from .models import *


class BranchSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = Branch
        fields = ['id','branch_name','manager','address','city',
                  'county','phone_number','operating_hours','is_active','tenant']
        read_only_fields = ['tenant']
        
class StockTransferSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = StockTransfer
        fields = ['id','from_branch','to_branch','product','quantity','reason',
                  'status','requested_at','approved_at','rejected_at','tenant']
        read_only_fields = ['tenant','reason',
                  'status','requested_at','approved_at','rejected_at',]
from rest_framework import serializers
from .models import *


class BillSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Bill
        fields = ['id','bill_number','bill_date','due_date','vendor_name',
                  'vendor_email','vendor_phone','vendor_address','subtotal','total_tax','total_amount','tenant']
        
        
class BillItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BillItem
        fields = ['id','bill','description','quantity','rate','tax_rate']
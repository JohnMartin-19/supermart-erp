from rest_framework import serialziers
from .models import *


class productSerializer(serialziers.ModelSerializer):
    
    class Meta:
        model  = Product
        fields = ['id','name','sku','categories','price','supplier','stock_status', 'tenant']
        read_only_fields = ['tenant']
        
class InventorySerializer(serialziers.ModelSerializer):
    
    class Meta:
        model = Inventory
        fields = ['id','product','branch','current_stock','min_stock','max_stock','tenant']
        read_only_fields = ['tenant']
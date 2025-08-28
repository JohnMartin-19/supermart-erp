from rest_framework import serializers
from .models import *

class InventorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Inventory
        fields = ['id','product','branch','current_stock','min_stock','max_stock','tenant']
        read_only_fields = ['tenant']
class productSerializer(serializers.ModelSerializer):
    inventory = InventorySerializer(read_only=True, many=True, source="inventory_set")
    class Meta:
        model  = Product
        fields = ['id','name','sku','categories','price','supplier','stock_status', 'tenant', 'inventory']
        read_only_fields = ['tenant']
        
    def create(self, validated_data):
        current_stock = validated_data.pop("current_stock", 0)
        min_stock = validated_data.pop("min_stock", 0)
        max_stock = validated_data.pop("max_stock", 0)
        product = super().create(validated_data)
        Inventory.objects.create(
            product=product,
            branch=None,  
            current_stock=current_stock,
            min_stock=min_stock,
            max_stock=max_stock,
            tenant=product.tenant
        )
        

from rest_framework import serializers
from .models import Product, Inventory

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['id', 'product', 'branch', 'current_stock', 'min_stock', 'max_stock', 'tenant']
        read_only_fields = ['tenant', 'product']


class ProductSerializer(serializers.ModelSerializer):

    inventory = InventorySerializer(required=False, many=True, source="inventory_set")

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'categories', 'price',
            'supplier', 'stock_status', 'tenant', 'inventory'
        ]
        read_only_fields = ['tenant']

    def create(self, validated_data):

        inventory_data = validated_data.pop("inventory_set", [])

        product = Product.objects.create(**validated_data)

        if not inventory_data:
          
            Inventory.objects.create(
                product=product,
                branch=None,
                current_stock=0,
                min_stock=0,
                max_stock=0,
                tenant=product.tenant
            )
        else:
         
            for inv in inventory_data:
                Inventory.objects.create(
                    product=product,
                    branch=inv.get("branch"),
                    current_stock=inv.get("current_stock", 0),
                    min_stock=inv.get("min_stock", 0),
                    max_stock=inv.get("max_stock", 0),
                    tenant=product.tenant
                )

        return product

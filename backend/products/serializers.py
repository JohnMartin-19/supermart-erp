from rest_framework import serializers
from .models import *


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name','description','category','supplier','cost_price',
                  'selling_price','initial_stock','current_stock','minimum_stock_level']
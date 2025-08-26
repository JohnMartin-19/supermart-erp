from rest_framework import serializers
from .models import *


       
        
class BillItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BillItem
        fields = ['id','bill','description','quantity','rate','tax_rate']
        read_only_fields = ['bill']
        
        
class BillSerializer(serializers.ModelSerializer):
    
    items = BillItemSerializer(many = True)
    class Meta:
        model = Bill
        fields = ['id','bill_number','bill_date','due_date','vendor_name',
                  'vendor_email','vendor_phone','vendor_address','subtotal','total_tax','total_amount','tenant','items']
        read_only_fields = ['tenant']
        
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        subtotal = sum(item['quantity'] * item['rate'] for item in items_data)
        total_tax = sum(item['quantity'] * item['rate'] * (item['tax_rate'] / 100) for item in items_data)
        total_amount = subtotal + total_tax
        validated_data['subtotal'] = subtotal
        validated_data['total_tax'] = total_tax
        validated_data['total_amount'] = total_amount
        bill = Bill.objects.create(**validated_data)
        for item in items_data:
            BillItem.objects.create(bill=bill, **item)
            
        return bill

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                BillItem.objects.create(bill=instance, **item_data)

        return instance
 
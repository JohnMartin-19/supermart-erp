from datetime import timezone
from rest_framework import serializers
from customers.models import *
from .models import *

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'product', 'description', 'quantity', 'rate', 'tax_rate']
        extra_kwargs = {"id": {"read_only": True}}

class InvoiceSerializer(serializers.ModelSerializer):
    
    items = InvoiceItemSerializer(many=True)
    
    class Meta:
        model = Invoice
       
        fields = [
            'id', 'invoice_number', 'invoice_date', 'due_date',
            'customer_name', 'customer_email', 'customer_address',
            'customer_phone', 'notes',
            'subtotal', 'total_tax', 'total_amount', 'tenant', 'items'
        ]
        read_only_fields = ['tenant', 'total_tax']
        
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        subtotal = sum(item['quantity'] * item['rate'] for item in items_data)
        total_tax = sum(item['quantity'] * item['rate'] * (item['tax_rate'] / 100) for item in items_data)
        total_amount = subtotal + total_tax
        validated_data['subtotal'] = subtotal
        validated_data['total_tax'] = total_tax
        validated_data['total_amount'] = total_amount
        invoice = Invoice.objects.create(**validated_data)
        for item in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item)
            
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                InvoiceItem.objects.create(invoice=instance, **item_data)

        return instance
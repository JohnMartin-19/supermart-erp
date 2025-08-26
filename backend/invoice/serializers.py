from rest_framework import serializers
from .models import *

class InvoiceItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = InvoiceItem
        fields = ['id','invoice','product','description','rate','tax_rate']

class InvoiceSerializer(serializers.ModelSerializer):
    
    items = InvoiceItemSerializer(many=True)
    
    class Meta:
        model = Invoice
        fields = ['id','invoice_number','invoice_date','due_date','customer_name','customer','customer_email','customer_address',
                  'customer_phone','customer_gstin','notes','subtotal','total_tax','total_amount','tenant','items']
        read_only_fields = ['tenant']
        
        
    def create(self, validated_data):
        items_data = validated_data.pop('items', None)
        invoice = Invoice.objects.create(**validated_data)
        for item in items_data:
            InvoiceItem.objects.create(invoice = invoice, **item)
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
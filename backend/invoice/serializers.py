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
    # customer = CustomerSerializer() 

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'invoice_date', 'due_date',
            'notes', 'subtotal', 'total_tax', 'total_amount',
            'tenant', 'items', 'customer', 'customer_name','customer_address',
            'customer_email','customer_phone'
        ]
        read_only_fields = ['tenant', 'subtotal', 'total_tax', 'total_amount']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        if not validated_data.get("invoice_date"):
            validated_data["invoice_date"] = timezone.now().date()
        request = self.context.get('request')
        tenant = getattr(request.user, "tenant", None) if request else None

        invoice = Invoice.objects.create(tenant=tenant)
        for item in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item)

        return invoice
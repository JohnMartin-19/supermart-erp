from rest_framework.serializers import serializers
from .models import *

class PaymentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Payments
        fields = ['id','customer_name','customer_email','customer_phone',
                  'payment_type','total_amount','total_vat','transaction_id',
                  'mpesa_reference','card_last4','timestamp','order','tenant']
        read_only_fields = ['tenant','mpesa_reference','card_last4',
                            'transaction_id','timestamp']
from rest_framework import serializers
from .models import *

class CashDrawerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CashDrawer
        fields = ['id','branch','cashier','opening_balance',
                  'current_balance','status','opened_at','closed_at','tenant']
        
class CashReconciliationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CashReconciliation
        fields = ['id','cash_drawer','actual_cash_count','notes','recorded_at','tenant']
        read_only_fields = ['tenant','recorded_at']
        
class CashExpenseSerializer(serializers.ModelSerializers):
    
    class Meta:
        model = CashExpense
        fields = ['id','branch','cash_drawer','amount','description','recorded_at','tenant']
        read_only_fields = ['tenant','recorded_at']
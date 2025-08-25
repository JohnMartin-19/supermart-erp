from rest_framework import serializers
from .models import *
from multi_location.models import *
from authentication.models import *

class CashDrawerSerializer(serializers.ModelSerializer):
    branch = serializers.SlugRelatedField(
        slug_field='branch_name', 
        queryset=Branch.objects.all()
    )
    cashier = serializers.SlugRelatedField(
        slug_field='username',  
        queryset=User.objects.all()
    )
    class Meta:
        model = CashDrawer
        fields = ['id','branch','cashier','opening_balance',
                  'current_balance','status','opened_at','closed_at','tenant']
        read_only_fields = ['tenant']
        
class CashReconciliationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CashReconciliation
        fields = ['id','cash_drawer','actual_cash_count','notes','recorded_at','tenant']
        read_only_fields = ['tenant','recorded_at']
        
class CashExpenseSerializer(serializers.ModelSerializer):
    cash_drawer = serializers.PrimaryKeyRelatedField(
        queryset=CashDrawer.objects.all()
    )
    branch = serializers.SlugRelatedField(
        slug_field='branch_name',
        read_only=True
    )
    class Meta:
        model = CashExpense
        fields = ['id','branch','cash_drawer','amount','description','recorded_at','tenant']
        read_only_fields = ['tenant','recorded_at']
        
    def create(self,validated_data):
        cash_drawer = validated_data.get('cash_drawer')
        validated_data['branch'] = cash_drawer.branch
        return super().create(validated_data)
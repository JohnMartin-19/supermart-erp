from .models import *
from rest_framework import serializers


class EmployeeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Employees
        fields = ['id','full_name','employee_id','designation',
                  'department','is_active','tenant']
        read_only_fields = ['tenant']
from rest_framework import serializers
from .models import *

class ActiivtyLogSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ActivityLogs
        fields = ['id','action_type','message','timespamp','tenant']
        read_only_fields = ['tenant']
        
        
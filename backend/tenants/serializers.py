from rest_framework import serializers
from .models import *

class ActivityLogSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ActivityLogs
        fields = ['id','action_type','message','timestamp','tenant']
        read_only_fields = ['tenant']
        
        
from rest_framework import serializers
from .models import *


class CustomerSerializer(serializers.ModelSerializer):
    membership_tier = serializers.ChoiceField(choices=TIERS, required=False)


    class Meta:
        model = Customer
        fields = ['id','full_name','email','phone_number','address','membership_tier',
                  'member_since','last_visit','updated_at','tenant','is_active']
        read_only_fields = ['tenant']
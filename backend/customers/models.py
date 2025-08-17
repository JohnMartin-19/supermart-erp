from django.db import models

# Create your models here.
TIERS = [
    {'regular':'Regular'},
    {'silver':'Silver'},
    {'gold':'Gold'},
    {'platinum':'Platinum'},
]

class Customer(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.CharField(max_length=100)
    membership_tier = models.CharField(max_length=20, choices=TIERS)
    member_since = models.DateField(auto_now_add=True)
    last_visit = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.full_name
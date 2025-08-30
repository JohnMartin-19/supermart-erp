from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Tenant(TenantMixin):
    name = models.CharField(max_length=100,blank=False, null=False)
    owner = models.ForeignKey(
        "authentication.User", 
        on_delete=models.CASCADE,
        related_name="owned_tenant",
        null=True,
        blank=True
    )
    contact_person = models.CharField(max_length=100,null=False, blank=False)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(blank = False, null=False)
    is_active = models.BooleanField(default=True)
    paid_until = models.DateField(null=True, blank=True)
    created_on = models.DateField(auto_now_add=True)
    on_trial = models.BooleanField(default=True)
    
    max_users = models.IntegerField(default=5)
    # subscriptionPlan = models.ForeignKey('SubscriptionPlan', on_delete=models.SET_NULL,null=True,blank=True)
    
    transaction_count = models.IntegerField(default=0)
    
    auto_schema_create = True
    
    
    def __str__(self):
        return f"{self.name} - {self.is_active} " 
    
class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=50, unique=True)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2)
  
class Domain(DomainMixin):
    pass
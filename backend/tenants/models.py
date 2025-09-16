from django.db import models
from django_tenants.models import TenantMixin, DomainMixin

class Tenant(TenantMixin):
    name = models.CharField(max_length=100,blank=False, null=False)
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



class ActivityLogs(models.Model):
    ACTION_CHOICES = [
        ('invoice_created', 'Invoice Created'),
        ('employee_created', 'Employee Created'),
        ('bill_created', 'Bill Created'),
        ('branch_created', 'Branch Created'),
        ('stock_transfer_initiated', 'Stock Transfer Initiated'),
        ('cash_recon_created', 'Cash Recon Created'),
        ('invoice_created', 'Invoice Created'),
        ('inventory_item_created', 'Inventory Item Created'),
        ('product_created', 'Product Created'),
        ('payment_received', 'Payment Received'),
        ('customer_added', 'Customer Added'),
        ('user_added', 'User Added'),
        ('inventory_alert', 'Inventory Alert'),
        ('tax_filed', 'Tax Filed'),
        ('payroll_processed', 'Payroll Processed'),
    ]
    
    action_type = models.CharField(max_length=100, choices=ACTION_CHOICES)
    message = models.TextField(null = True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, blank=True, null=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f'{self.action_type} at {self.timestamp}'
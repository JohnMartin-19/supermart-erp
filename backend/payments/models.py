from django.db import models
from tenants.models import *
from products.models import *

class Payments(models.Model):
    customer_name = models.CharField(max_length=100, null = True, blank = True)
    customer_email = models.EmailField(null=True, blank=True)
    customer_phone = models.CharField(max_length=100,null = True, blank=True)
    payment_type = models.CharField(max_length=100,null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount received from the customer")
    transaction_id = models.CharField(max_length=100, null = True, blank= True)
    mpesa_reference = models.CharField(max_length=50, blank=True)
    card_last4 = models.CharField(max_length=4, blank=True, help_text="Last 4 digits of the card for record keeping.")
    timestamp = models.DateField(auto_now_add=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name = 'payments')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.customer_name} paid {self.total_amount} at {self.timestamp}'
    
    class Meta:
        verbose_name_plural = 'Payments'
        ordering = ['-timestamp']


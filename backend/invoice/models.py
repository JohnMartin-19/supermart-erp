from django.db import models

class Invoice(models.Model):
   
    invoice_number = models.CharField(max_length=50, unique=True)
    invoice_date = models.DateField()
    due_date = models.DateField(null=True, blank=True)

    customer = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField(null=True, blank=True)
    customer_phone = models.CharField(max_length=20, null=True, blank=True)
    customer_address = models.CharField(max_length=255, null=True, blank=True)
    customer_gstin = models.CharField(max_length=15, null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"Invoice #{self.invoice_number}"

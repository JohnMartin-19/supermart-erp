from django.db import models

class Invoice(models.Model):
   
    invoice_number = models.CharField(max_length=50, unique=True)
    invoice_date = models.DateField(auto_created=True, null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)

    customer = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField(null=True, blank=True)
    customer_phone = models.CharField(max_length=20, null=True, blank=True)
    customer_address = models.CharField(max_length=255, null=True, blank=True)
   
    notes = models.TextField(blank=True)
    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE,null=True, blank=True)

    def __str__(self):
        return f"Invoice #{self.invoice_number}"


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.SET_NULL, null=True) # Optional link to a product
    description = models.TextField()
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.18) # 18% as default example
    
    def __str__(self):
        return self.description
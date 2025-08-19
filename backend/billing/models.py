from django.db import models

#this app handles transactions with vendors

class Bill(models.Model):
    bill_number = models.CharField(max_length=50, unique=True)
    bill_date = models.DateField()
    due_date = models.DateField()
    vendor = models.ForeignKey('suppliers.Supplier', on_delete=models.SET_NULL, null=True)
    vendor_name = models.CharField(max_length=255)
    vendor_email = models.EmailField(null=True, blank=True)
    vendor_phone = models.CharField(max_length=20, null=True, blank=True)
    vendor_address = models.CharField(max_length=255, null=True, blank=True)
    vendor_gstin = models.CharField(max_length=15, null=True, blank=True)    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"Bill #{self.bill_number}"


class BillItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.SET_NULL, null=True) 
    description = models.TextField()
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.18)
    
    def __str__(self):
        return self.description
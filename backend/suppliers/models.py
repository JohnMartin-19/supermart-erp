from django.db import models
from products.models import CATEGORIES


ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('in_transit', 'In Transit'),
    ('received', 'Received'),
    ('cancelled', 'Cancelled'),
]

class Supplier(models.Model):
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    category = models.CharField(max_length=100, choices=CATEGORIES,null=True)
    address = models.CharField(max_length=255, blank=True)
    payment_terms = models.CharField(max_length=100)
    credit_limit = models.PositiveBigIntegerField(null=True)
    is_active = models.BooleanField(default=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name
    
class PurchaseOrder(models.Model):
    supplier = models.ForeignKey(Supplier,on_delete=models.SET_NULL,null=True)
    delivery_date = models.DateField()
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=100,choices=ORDER_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return f"PO #{self.id} for {self.supplier.company_name}"
    
    
class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE,related_name = 'items')
    product_name = models.ForeignKey('products.Product',on_delete=models.CASCADE,related_name = 'purchase_items')
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10,decimal_places=2)
    
    def __str__(self):
        return f"{self.product_name.name} x {self.quantity}"

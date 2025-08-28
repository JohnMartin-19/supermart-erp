from django.db import models


CATEGORY_CHOICE = [
    ('Electronics', 'Electronics'),
    ('Accessories', 'Accessories'),
    ('Furniture', 'Furniture'),
    ('Apparel', 'Apparel'),
    ('Books', 'Books'),
    ('Home & Garden', 'Home & Garden'),
    ('Toys & Games', 'Toys & Games'),
    ('Sports & Outdoors', 'Sports & Outdoors'),
    ('Health & Beauty', 'Health & Beauty'),
    ('Automotive', 'Automotive'),
] 

STATUS_CHOICES = [
    ('In Stock', 'In Stock'),
    ('Low Stock', 'Low Stock'),
    ('Out of Stock', 'Out of Stock'),
]
class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=100)
    categories = models.CharField(max_length=100, null=True, blank=True, choices=CATEGORY_CHOICE)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    supplier = models.CharField(max_length=100, null=True, blank=True)
    stock_status = models.CharField(max_length=100, null=True, choices=STATUS_CHOICES)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE,related_name='inventory_products')
    
    def __str__(self):
        return self.name
    
    
class   Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    branch = models.ForeignKey('multi_location.Branch', on_delete=models.CASCADE)
    current_stock = models.PositiveIntegerField(default=0)
    min_stock = models.PositiveIntegerField(default=0)
    max_stock = models.PositiveIntegerField(default=0)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE,related_name='inventory_entries')

    class Meta:
        unique_together = ('product', 'branch')
        verbose_name_plural = 'Inventory'
        
    def __str__(self):
        return f"{self.product.name} at {self.branch.branch_name}"
from django.db import models



class Category(models.Model):
    name = models.CharField(max_length=100,unique=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE,related_name='inventory_categories')
    
    class Meta:
        verbose_name_plural = 'categories'
        
    def __str__(self):
        return self.name
    
    
class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=100)
    categories = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name = 'products')
    price = models.DecimalField(max_digits=10,decimal_places=2)
    supplier = models.ForeignKey('suppliers.Supplier', on_delete=models.SET_NULL, null=True, related_name='products')
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
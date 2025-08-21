from django.db import models



class Category(models.Model):
    name = models.CharField(max_length=100,unique=True)
    tenant = models.ForeignKey('tenent.Tenant', on_delete=models.CASCADE)
    
    class Meta:
        verbose_name_plural = 'categories'
        
    def __str__(self):
        return self.name
    
    
class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=100)
    categories = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name = 'products')
    price = models.DecimalField(max_digits=10,decimal_places=2)
    tenant = models.ForeignKey('tenant.Tenant', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    
    
class   Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    branch = models.ForeignKey('multi_location', on_delete=models.CASCADE)
    current_stock = models.PositiveIntegerField(default=0)
    min_stock = models.PositiveIntegerField(default=0)
    max_stock = models.PositiveIntegerField(default=0)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    class Meta:
        unique_tohether = ('product', 'branch')
        verbose_name_pluarl = 'Inventory'
        
    def __str__(self):
        return f"{self.product.name} at {self.branch.branch_name}"
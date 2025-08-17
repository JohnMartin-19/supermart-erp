from django.db import models


categories = [
    {'dairy':'Dairy'},
    {'meat':'Meat'},
    {'fruits':'Fruits'},
    {'vegetables':'Vegetables'},
    {'grains':'Grains'},
    {'nuts':'Nuts'},
    {'spices':'Spices'},
    {'pasta':'Pasta'},
    {'canned goods':'Canned Goods'},
    {'baking supplies':'Baking Supplies'},
    {'snacks':'Snacks'},
    {'pet food':'Pet Food'},
    {'household items':'Household Items'},
    {'beverages':'Beverages'},
    {'personal care':'Personal Care'},
    {'baby care':'Baby Care'},
    {'pet care':'Pet Care'},
    {'office supplies':'Office Supplies'},
    {'arts and crafts':'Arts and Crafts'},
    {'books and media':'Books and Media'},
    {'sports equipment':'Sports Equipment'},
    {'musical instruments':'Musical Instruments'},
    {'outdoor equipment':'Outdoor Equipment'},
    {'tools':'Tools'},
    {'furniture':'Furniture'},
    {'home decor':'Home Decor'},
    {'garden supplies':'Garden Supplies'},
    {'garage and storage':'Garage and Storage'},
    {'auto parts':'Auto Parts'},
    {'vintage and collectibles':'Vintage and Collectibles'},
    {'other':'Other'},
    
]

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=255)
    barcode = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    
    # Relationships
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, related_name='products')
    
    # Pricing & Profitability
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Inventory
    initial_stock = models.PositiveIntegerField(default=0)
    current_stock = models.PositiveIntegerField(default=0)
    minimum_stock_level = models.PositiveIntegerField(default=0)
    
    # Attributes & Status
    vat_applicable = models.BooleanField(default=False)
    is_perishable = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Multi-Tenancy
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Set initial_stock to current_stock only on creation
        if not self.pk:
            self.current_stock = self.initial_stock
        super().save(*args, **kwargs)

    @property
    def margin(self):
        if self.cost_price > 0:
            return ((self.selling_price - self.cost_price) / self.cost_price) * 100
        return 0
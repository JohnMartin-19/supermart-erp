from django.db import models
from django.utils import timezone
from authentication.models import *
from tenants.models import *
CATEGORIES = [
    ('dairy', 'Dairy'),
    ('meat', 'Meat'),
    ('fruits', 'Fruits'),
    ('vegetables', 'Vegetables'),
    ('grains', 'Grains'),
    ('nuts', 'Nuts'),
    ('spices', 'Spices'),
    ('pasta', 'Pasta'),
    ('canned_goods', 'Canned Goods'),
    ('baking_supplies', 'Baking Supplies'),
    ('snacks', 'Snacks'),
    ('pet_food', 'Pet Food'),
    ('household_items', 'Household Items'),
    ('beverages', 'Beverages'),
    ('personal_care', 'Personal Care'),
    ('baby_care', 'Baby Care'),
    ('pet_care', 'Pet Care'),
    ('office_supplies', 'Office Supplies'),
    ('arts_and_crafts', 'Arts and Crafts'),
    ('books_and_media', 'Books and Media'),
    ('sports_equipment', 'Sports Equipment'),
    ('musical_instruments', 'Musical Instruments'),
    ('outdoor_equipment', 'Outdoor Equipment'),
    ('tools', 'Tools'),
    ('furniture', 'Furniture'),
    ('home_decor', 'Home Decor'),
    ('garden_supplies', 'Garden Supplies'),
    ('garage_and_storage', 'Garage and Storage'),
    ('auto_parts', 'Auto Parts'),
    ('vintage_and_collectibles', 'Vintage and Collectibles'),
    ('other', 'Other'),
]

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=255)
    barcode = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    #relationships
    category = models.CharField(max_length=50, choices=CATEGORIES)
    supplier = models.ForeignKey('suppliers.Supplier', on_delete=models.SET_NULL, null=True, related_name='supplier_products')
    # pricing & profitability
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    #inventory
    initial_stock = models.PositiveIntegerField(default=0)
    current_stock = models.PositiveIntegerField(default=0)
    minimum_stock_level = models.PositiveIntegerField(default=0) 
    # attributes & status
    vat_applicable = models.BooleanField(default=False)
    is_perishable = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    #multi-tenancy
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE,related_name='product_catalog_items', null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
       
        if not self.pk:
            self.current_stock = self.initial_stock
        super().save(*args, **kwargs)

    @property
    def margin(self):
        if self.cost_price > 0:
            return ((self.selling_price - self.cost_price) / self.cost_price) * 100
        return 0 
    
class Order(models.Model):
    order_id = models.CharField(max_length=30, editable=False, blank=True)
    timestamp = models.DateTimeField(default=timezone.now())
    cashier = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    total_amount = models.DecimalField(decimal_places=2,max_digits=10, default=0)
    total_vat = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null = True)
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = f'ORD-{timezone.now().strftime("%Y%m%d%H%M%S")}'
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f'Order {self.order_id} - {self.status}'
    
    class Meta:
        ordering = ['-timestamp']
        
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    price_at_sale = models.DecimalField(max_digits=10, decimal_places=2)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f'{self.product.name} ({self.quantity})'
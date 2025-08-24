from django.db import models


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
from django.db import models
from products.models import CATEGORIES


class Supplier(models.Model):
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    category = models.CharField(max_length=100, choices=CATEGORIES)
    address = models.CharField(max_length=255, blank=True)
    payment_terms = models.CharField(max_length=100)
    credit_limit = models.PositiveBigIntegerField(null=True)
    is_active = models.BooleanField(default=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

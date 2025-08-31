from django.contrib.auth.models import AbstractUser
from django.db import models
from tenants.models import Tenant
from multi_location.models import Branch
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager

class User(AbstractBaseUser,PermissionsMixin):
    first_name = models.CharField(max_length=100,null=True)
    last_name = models.CharField(max_length=100,null=True)
    username = models.CharField(max_length=100,null=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100, null =False, blank=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True,related_name='users')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    is_staff = models.BooleanField(default=True)

    COMPANY_SIZE_CHOICES = [
        ("1-10", "1-10"),
        ("11-50", "11-50"),
        ("51-200", "51-200"),
        ("201-500", "201-500"),
        ("500+", "500+"),
    ]
    company_size = models.CharField(
        max_length=20,
        choices=COMPANY_SIZE_CHOICES,
        blank=True,
        null=True,
    )
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.email})"
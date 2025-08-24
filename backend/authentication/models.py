from django.contrib.auth.models import AbstractUser
from django.db import models
from tenants.models import Tenant
from multi_location.models import Branch

class User(AbstractUser):
    pass
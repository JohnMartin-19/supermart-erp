from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # This enables the admin for tenants
    path('admin/', admin.site.urls),
    # URLs for your tenant-specific apps
    path("api/v1/products/", include('products.urls')),
    path("api/v1/customers/", include('customers.urls')),
    path('api/v1/suppliers/', include('suppliers.urls')),
    path("api/v1/multi_location/", include('multi_location.urls')),
    path('api/v1/cash/', include('cash_management.urls')),
]
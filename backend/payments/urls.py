from django.urls import path
from .views import *


urlpatterns = [
    path('mpesa_pay/',STKPushAPIView.as_view() )
]
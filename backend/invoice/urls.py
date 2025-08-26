from django.urls import path
from .views import *

urlpatterns = [
    path('quick_invoices/', InvoiceListCreateAPIView.as_view()),
    path('quick_invoices/<int:pk>', InvoiceRetrieveUpdateDestroyAPIView.as_view())
]
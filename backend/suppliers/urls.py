from django.urls import path
from .views import *


urlpatterns = [
    path("suppliers/",SupplierListCreateAPIView.as_view()),
    path("suppliers/<int:pk>",SupplierRetrieveUpdateDestroyAPIView.as_view()),
    path("purchase_orders/", PurchaseOrderListCreateAPIView.as_view()),
    path('purchase_orers/<int:pk>', PurchaseOrderRetriveUpdateDestroyAPIView.as_view())
]
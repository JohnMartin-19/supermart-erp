from django.urls import path
from .views import *


urlpatterns = [
    path("suppliers/",SupplierListCreateAPIView.as_view()),
    path("suppliers/<int:pk>",SupplierRetrieveUpdateDestroyAPIView.as_view()),
]
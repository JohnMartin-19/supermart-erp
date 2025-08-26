from django.urls import path
from .views import *


urlpatterns = [
    path('bills/', BillListCreateBillAPIView.as_view()),
    path('bills/<int:pk>/', BillRetrieveUpdateDestroyAPIView.as_view())
]
from django.urls import path
from .views import *

urlpatterns = [
    path('cash_drawer/', CashDrawerListCreateAPIView.as_view(),name = 'cash_drawer'),
    path('cash_drawer/<int:pk>/', CashDrawerRetrieveUpdateDestroyAPIView.as_view(), name = 'cash_drawer_instance'),
    path('cash_expense/', CashExpenseListCreateAPIView.as_view(),name = 'cash_expense' ),
    path('cash_expense/<int:pk>', CashExpenseRetrieveUpdateDestroyAPIView.as_view(), name = 'cash_expense_instance'),
    path('cash_reconciliation/', CashReconciliationListCreateAPIView.as_view(), name = 'cash_reconciliation'),
    path('cash_reconciliation/<itn:pk>', CashReconciliationRetrieveUpdateDestroyAPIView.as_view(),name = 'cash_recon_instance'),
]
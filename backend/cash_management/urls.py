from django.urls import path
from .views import *

urlpatterns = [
    path('cash_drawers/', CashDrawerListCreateAPIView.as_view(),name = 'cash_drawer'),
    path('cash_drawers/<int:pk>/', CashDrawerRetrieveUpdateDestroyAPIView.as_view(), name = 'cash_drawer_instance'),
    path('cash_expenses/', CashExpenseListCreateAPIView.as_view(),name = 'cash_expense' ),
    path('cash_expenses/<int:pk>', CashExpenseRetrieveUpdateDestroyAPIView.as_view(), name = 'cash_expense_instance'),
    path('cash_reconciliations/', CashReconciliationListCreateAPIView.as_view(), name = 'cash_reconciliation'),
    path('cash_reconciliations/<int:pk>', CashReconciliationRetrieveUpdateDestroyAPIView.as_view(),name = 'cash_recon_instance'),
]
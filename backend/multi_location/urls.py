from django.urls import path
from .views import *

urlpatterns = [
    path('branches/',BranchListCreateAPIView.as_view(), name='all branches'),
    path('branches/<int:pk>/', BranchRetrieveUpdateDestroyAPIView.as_view()),
    path('stock_transfers/', StockTransferListCreateAPIView.as_view()),
    path('stock_transfers/<int:pk>/', StockTransferRetrieveUpdateDestroyAPIView.as_view())
]
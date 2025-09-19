from django.urls import path
from .views import *

urlpatterns = [
    path('employees/', EmployeeListCreateAPIView.as_view()),
    path('employees/<int:pk>/', EmployeeRetrieveUpdateDestroyAPIView.as_view()),
    path('process_payroll/', PayrollProcessView.as_view()),
]

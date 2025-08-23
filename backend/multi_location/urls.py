from django.urls import path
from .views import *

urlpatterns = [
    path('branches/',BranchListCreateAPIView.as_view(), name='all branches'),
    path('branches/<int:pk>/', BranchRetrieveUpdateDestroyAPIView.as_view()),
]
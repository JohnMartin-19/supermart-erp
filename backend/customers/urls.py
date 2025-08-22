from django.urls import path
from .views import *



urlpatterns = [
    path("customers/", CustomerListCreateAPIView.as_view()),
    path("customers/<int:pk>/", CustomerRetrieveUpdateDestroyAPIView.as_view())
]
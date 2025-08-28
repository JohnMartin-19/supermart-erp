from django.urls import path
from .views import *


urlpatterns = [
    path('products/', ProductListCreateAPIView.as_view()),
    path('products/<int:pk>', ProductRetrieveUpdateDestroyAPIView.as_view())
]
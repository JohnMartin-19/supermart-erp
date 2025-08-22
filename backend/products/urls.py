from django.urls import path
from .views import *


urlpatterns = [
    path('products/', ProductListCreateAPIView.as_view()),
]
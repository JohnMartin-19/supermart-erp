from django.urls import path
from .views import *


urlpatterns = [
    path("recent_activities", ActivityLogsAPIView.as_view()),
]

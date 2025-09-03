from django.shortcuts import render
from .models import *
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *

class ActivityLogsAPIView(ListAPIView):
    """
    GET REQUEST: To simply map the recent transactions happening across 
    the system at large
    """
    serializer_class = ActivityLogSerializer
    def get_queryset(self):
        return ActivityLogs.objects.filter(tenant = self.request.user.tenant).order_by('-timestamp')[:10]
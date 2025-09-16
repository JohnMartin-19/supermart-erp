from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from tenants.models import *


class EmployeeListCreateAPIView(APIView):
    """
    GET METHOD: Query all emloyees form the db
    """
    serializer_classes = EmployeeSerializer
    
    def get(self,request):
        employees = Employees.objects.all()
        serializer = self.serializer_classes(employees)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
        
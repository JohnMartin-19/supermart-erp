from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from tenants.models import *
from django.db import transaction

class EmployeeListCreateAPIView(APIView):
    
    serializer_class = EmployeeSerializer
    
    def get(self,request):
        """
        GET METHOD: Query all emloyees form the db
        """
        employees = Employees.objects.all()
        serializer = self.serializer_class(employees)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    def post(self, request):
        """
        POST METHOD: To create a new employee
        """
        data = request.data
        employee_name = data.get('full_name')
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save(tenant = request.user.tenant)
                ActivityLogs.objects.create(
                    tenant=request.user.tenant,
                        action_type='employee_created',
                        message=f'A new employee by the name "{employee_name}" has been added.'
                )
                return Response({
                    "message": "Success",
                    "data": serializer.data
                },status = status.HTTP_200_OK)
        return Response({"message":"Failed"}, status = status.HTTP_400_BAD_REQUEST)
                
        
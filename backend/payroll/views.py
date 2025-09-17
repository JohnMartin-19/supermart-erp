import uuid
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from tenants.models import *
from django.db import transaction
from datetime import datetime, timezone

class EmployeeListCreateAPIView(APIView):
    
    serializer_class = EmployeeSerializer
    
    def get(self,request):
        """
        GET METHOD: Query all emloyees form the db
        """
        employees = Employees.objects.all()
        serializer = self.serializer_class(employees, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    def post(self, request):
        """
        POST METHOD: To create a new employee
        """
        data = request.data
        print('DATTATTA:',data)
        employee_name = data.get('full_name')
        timestamp = datetime.now()
        unique_suffix = uuid.uuid4().hex[:6]
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            with transaction.atomic():
                serializer.save(tenant = request.user.tenant, employee_id = f'EMP{timestamp}{unique_suffix}')
                ActivityLogs.objects.create(
                    tenant=request.user.tenant,
                        action_type='employee_created',
                        message=f'A new employee by the name "{employee_name}" has been added.'
                )
                return Response({
                    "message": "Employee created successfully",
                    "data": serializer.data
                },status = status.HTTP_200_OK)
        return Response({"message":"Failed to create employee"}, status = status.HTTP_400_BAD_REQUEST)
                
class EmployeeRetrieveUpdateDestroyAPIView(APIView):
    
    serializer_class = EmployeeSerializer
     
    def get_object(self,pk):
        '''
        helper method
        '''
        return get_object_or_404(pk=pk)
    
    def get(self,request,pk):
        employee = self.get_object(pk)
        serializer = self.serializer_class(employee)
        return Response({'message':'Success','data':serializer.data}, status= status.HTTP_200_OK)
    
    def put(self, request, pk):
        employee = self.get_object(pk=pk)
        serializer = self.serializer_class(employee, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Employee updated successfully', 'data':serializer.data}, status = status.HTTP_200_OK)
        return Response({'message':'Failed to update the employee entity','data':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, pk):
        employee = self.get_object(pk)
        employee.delete()
        return Response({'message':'Employee deleted successfully'}, status= status.HTTP_204_NO_CONTENT)
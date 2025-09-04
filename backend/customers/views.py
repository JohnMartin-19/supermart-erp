from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from django.shortcuts import get_object_or_404
from .models import *
from tenants.models import *
class CustomerListCreateAPIView(APIView):
    
    """
        GET METHOD: method to get all cstomers 
    """
    
    def get(self, request):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    """
        POST METHOD: To create a new customer
    """
    def post(self, request):
        data = request.data 
        full_name = data.get('full_name')
        serializer = CustomerSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(tenant=request.user.tenant)
            ActivityLogs.objects.create(
                        tenant=request.user.tenant,
                        action_type='customer_created',
                        message=f'A new customer, "{full_name}" has been added.'
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        
        
        
class CustomerRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get an instance of a customer
    """
    def get_object(self,pk):
        return get_object_or_404(Customer,pk=pk)
    
    
    """
    GET METHOD:To get a specific obj by its ID
    """
    
    def get(self, request,pk):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    """
    PUT/PATCH METHOD: To update a customer
    """
    
    def put(self,request,pk):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer,data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error)
    
    """
    DELETE METHOD: To delete a customer
    """
    def delete(self,request,pk):
        customer = self.get_object(pk)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MembershipTierAPIView(APIView):
    def get(self, request):
        pass
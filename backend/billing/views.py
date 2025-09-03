from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from django.shortcuts import get_object_or_404
from .models import *
from tenants.models import *

class BillListCreateBillAPIView(APIView):
    
    """
    
    GET Method: to fetch all the bills in our schema
    """
    
    def get(self, request):
        bills = Bill.objects.all()
        serializer = BillSerializer(bills, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
    POST METHOD: to create a new bill
    """
    def post(self, request):
        serializer = BillSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(tenant = request.user.tenant)
            ActivityLogs.objects.create(
                    tenant=request.user.tenant,
                    action_type='bill_created',
                    message=f'Bill for "{request.data.vendor_name}" created.'
            )
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
class BillRetrieveUpdateDestroyAPIView(APIView):
    """
    just a helper method to get an instance of a bill
    """
    
    def get_object(self, pk):
        return get_object_or_404(Bill, pk=pk)
    
    
    """
        GET METHOD:To retrieve an entire bill from schema
    """
    
    def get(self, pk):
        bill = self.get_object(pk)
        serializer = BillSerializer(bill)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
        PUT METHOD:For updating/editing a bill instance
    """
    
    def put(self, request, pk):
        bill = self.get_object(pk)
        serializer = BillSerializer(bill, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    """
     DELETE METHOD:To delete a bill instance from schema   
    """
    
    def delete(self, pk):
        bill = self.get_object(pk)
        bill.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)
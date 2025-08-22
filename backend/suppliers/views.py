from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404


class SupplierListCreateAPIView(APIView):
    """
    GET METHOD : To get all suppliers in our db/schema
    """
    def get(self,request):
        suppliers= Supplier.objects.all()
        serializer = SuppliersSerializer(suppliers)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    """
    POST METHOD:To add a new supplier to our system
    """
    def post(self,request):
        serializer = SuppliersSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    
    
    
class SupplierRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get an instane of an obj
    """
    
    def get_object(self, pk):
        return get_object_or_404(Supplier,pk=pk)
    
    """
    GET METHOD:To retrieve a supplier by ID    
    """
    
    def get(self,request,pk):
        supplier = self.get_object(pk)
        serializer = SuppliersSerializer(supplier)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
    PUT METHOD: To make updates on the supplier 
    """
    
    def put(self,request,pk):
        supplier = self.get_object(pk)
        serializer = SuppliersSerializer(supplier,data = request.data,partial = True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    def delete(self,request,pk):
        supplier = self.get_object(pk)
        supplier.delete()
        return Response(status= status.HTTP_204_NO_CONTENT)
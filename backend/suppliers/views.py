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
        serializer = SuppliersSerializer(suppliers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    """
    POST METHOD:To add a new supplier to our system
    """
    def post(self,request):
        serializer = SuppliersSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(tenant = request.user.tenant)
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
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
    
    
    
class PurchaseOrderListCreateAPIView(APIView):
    
    """
    GET METHOD: to get all purchase orders from our schema
    """
    
    def get(self, request):
        purchase_orders = PurchaseOrder.objects.all()
        serializer = PurchaseOrderSerializer(purchase_orders,many =True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
    POST METHOD: To create a new purchase order instance
    """
    
    def post(self, request):
        serializer = PurchaseOrderSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(tenant = request.user.tenant)
            return Response(serializer.data, status= status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    
class PurchaseOrderRetriveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get a single instance of a purchase order
    """
    def get_object(self,pk):
        return get_object_or_404(PurchaseOrder,pk=pk)
    
    """
    GET METHOD: To retrieve a particular purchase order
    """
    def get(self, request,pk):
        purchase_order = self.get_object(pk)
        serializer = PurchaseOrderSerializer(purchase_order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    """
    PUT METHOD: To update a single purchase order instance using its ID
    """
    
    def put(self, request, pk):
        purchase_order = self.get_object(pk)
        serializer =PurchaseOrderSerializer(purchase_order, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    """
    DELETE METHOD: To delete a single instance of an object
    """
    
    def delete(self, pk):
        purchase_order = self.get_object(pk)
        if not purchase_order:
            return Response({'message':"Purchase order does not exist"}, status=status.HTTP_404_NOT_FOUND)
        purchase_order.delete()
        return Response({"message":"Purchase order deleted successfully"}, status=status.HHTP_204_NO_CONTENT)
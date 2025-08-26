from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from django.shortcuts import get_object_or_404
from .models import *


class InvoiceListCreateAPIView(APIView):
    
    """
    GET METHOD: To get all invoices in our schema
    """
    
    def get(self, request):
        invoices = Invoice.objects.all()
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
    POST METHOD: To create an Invoice
    """
    
    def post(self, request):
        serializer =InvoiceSerializer(data = request.data)
        data = request.data
        print(data)
        if serializer.is_valid():
            serializer.save(tenant = request.user.tenant)
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
class InvoiceRetrieveUpdateDestroyAPIView(APIView):
    """
    Helper method to get an instace of an invoice
    """
    
    def get_object(self,pk):
        return get_object_or_404(Invoice, pk=pk)
    
    """
    GET METHOD: for retrieving
    """
    
    def get(self, request, pk):
        invoice = self.get_object(pk)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
        PUT METHOD: To update/edit an invoice
    """
    
    def put(self,request,pk):
        invoice = self.get_object(pk)
        serializer = InvoiceSerializer(invoice, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    
    
    def delete(self,pk):
        invoice = self.get_object(pk)
        invoice.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)
    
    

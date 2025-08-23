from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404



class BranchListCreateAPIView(APIView):
    
    """
    GET METHOD: To fetch all branches from our schema
    """
    
    def get(self,request):
        branches = Branch.objects.all()
        serializer = BranchSerializer(branches,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    """
    POST METHOD: To create a new branch
    """
    def post(self,request):
        serializer = BranchSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error)
    
    
class BranchRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get a specific object instance of a Branch by its ID
    """
    
    def get_object(self,request,pk):
        return get_object_or_404(Branch,pk=pk)
    
    """
    GET METHOD:To retrieve a branch with its ID
    """
    
    def get(self,request,pk):
        branch = self.get_object(pk)
        serializer = BranchSerializer(branch)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    """
    PUT METHOD:To update a branch instance using its ID
    """
    
    def put(self,request,pk):
        branch = self.get_object(pk)
        serializer = BranchSerializer(branch,data = request.data,partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.error)
    
    """
    DELETE METHOD:To delete a branch
    """
    def delete(self,request,pk):
        branch = self.get_object(pk)
        if branch:
            branch.delete()
            return Response(status = status.HTTP_204_NO_CONTENT)
        return Response("Branch does not exist", status = status.HTTP_404_NOT_FOUND)
            
       

class StockTransferListCreateAPIView(APIView):
    
    """
    GET METHOD:To fetch all instances of stock transfers
    """  
    def get(self, request):
        stock_transfers = StockTransfer.objects.all()
        serializer = StockTransferSerializer(stock_transfers)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    """
    POST METHOD:To create a new stock transfer
    """
    def post(self,request):
        serializer = StockTransferSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HHTP_201_CREATED)
        return Response(serializer.error)
    
class StockTransferRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get a single stock transfer instance by its ID
    """
    
    def get_object(self, pk):
        return get_object_or_404(StockTransfer,pk=pk)
    
    """
    GET METHOD: To retrieve a particular stock transfer
    """
    def get(self, request, pk):
        stock_transfer = self.get_object(pk)
        serializer = StockTransferSerializer(stock_transfer)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
    PUT METHOD:To update an existing stock transfer instance
    """
    
    def put(self, request, pk):
        stock_transfer = self.get_object(pk)
        serializer = StockTransferSerializer(stock_transfer, data = request.data, partial = True)
        if serializer.is_valid():
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.error)
    
    """
    DELETE METHOD: To delete a single instance of a stock transfer
    """
    def delete(self, request,pk):
        stock_transfer = self.get_object(pk)
        if stock_transfer:
            stock_transfer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response("Stock Transfer does not exist", status=status.HTTP_404_NOT_FOUND)
        
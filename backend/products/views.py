from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404

class ProductListCreateAPIView(APIView):
    """
    GET METHOD: To retrieve all products from the db
    """
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products,many=True)
        return Response(serializer.data)
    
    """
    POST METHOD: To create a new product
    """
    def post(self,request):
        serializer = ProductSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(tenant = request.user.tenant)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProductRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper function to get an object instance
    """
    def get_object(self,pk):
        return get_object_or_404(Product,pk=pk)
    
    """
    GET METHOD: To retrieve an object by ID 
    """
    def get(self, request,pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    """
    PUT/PATCH METHOD: To make partial update to a single product
    """
    def put(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product, data = request.data, partial = True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error)
    """
    DELETE METHOD: To delete a single product by ID
    """
    def delete(self,request,pk):
        product = self.get_object(pk)
        # serializer = ProductSerializer(product)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
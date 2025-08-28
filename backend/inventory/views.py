from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from django.shortcuts import get_object_or_404
from .models import *


class ProductListCreateAPIView(APIView):
    """
    GET METHOD: To get all products in our inventory
    """
    def get(self, request):
        products = Product.objects.all()
        serializer = productSerializer(products, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)
        
    """
        POST METHOD: TO create a new product and enlist it to our inventory
    """
    
    def post(self, request):
        serializer = productSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(tenant = request.user.tenant)
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
class ProductRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get a single instace of a product
    """
    
    def get_object(self, pk):
        return get_object_or_404(Product, pk = pk)
    
    """
      GET METHOD: To retrieve a product by its ID  
    """
    
    def get(self, request, pk):
        product = self.get_object(pk)
        serializer = productSerializer(product)
        return Response(serializer.data, status =status.HTTP_200_OK)
    
    """
        PUT METHOD: To edit/update a product instance
    """
    
    def put(self, request, pk):
        product = self.get_object(pk)
        serializer = productSerializer(product, data = request.data,partial =True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    """
    DELETE METHOD: To delete a product instance
    """
    
    def delete(self, pk):
        product = self.get_object(pk)
        product.delete()
        return Response({"message":"Product deleted"},status = status.HTTP_204_NO_CONTENT)
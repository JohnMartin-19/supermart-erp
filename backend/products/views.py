from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *

class ProductListCreateAPIView(APIView):
    """
    GET METHOD: To retrieve all products from the db
    """
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products)
        return Response(serializer.data)
    
    """
    POST METHOD: To create a new product
    """
    def post(self,request):
        serializer = ProductSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error)
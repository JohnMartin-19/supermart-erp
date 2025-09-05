from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from tenants.models import *
from django.db import transaction
class CashDrawerListCreateAPIView(APIView):
    
    """
    GET METHOD: To get all the cash drawers in our schema
    """
    
    def get(self,request):
        cash_drawers = CashDrawer.objects.all()
        serializer = CashDrawerSerializer(cash_drawers,many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
    POST METHOD: To creat a new Cash Drawer instance
    """
    
    def post(self, request):
        serializer = CashDrawerSerializer(data = request.data)
        branch = request.data.get('branch')
        opened_at = request.data.get('opened_at')
        with transaction.atomic():
            if serializer.is_valid():
                serializer.save(tenant = request.user.tenant)
                ActivityLogs.objects.create(
                        tenant=request.user.tenant,
                        action_type='cash_drawer_created',
                        message=f'Cash Drawer for "{branch}" created  at {opened_at}.'
                )
                return Response(serializer.data, status = status.HTTP_201_CREATED)
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        
    
class CashDrawerRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get an instace of a cash drawer from our schema
    """
    
    def get_object(self,pk):
        return get_object_or_404(CashDrawer,pk=pk)
    
    """
    GET METHOD:To get a specifice instance of a cash drawer from our schema
    """
    def get(self,request,pk):
        cash_drawer = self.get_object(pk)
        serializer = CashDrawerSerializer(cash_drawer)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
    PUT METHOD: To update an instance of a cash drawer using its ID
    """
    def put(self, request, pk):
        cash_drawer = self.get_object(pk)
        serializer = CashDrawerSerializer(cash_drawer, data = serializer.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    """
    DELETE METHOD: To delete a cash drawer instance from our schema
    """
    def delete(self,request, pk):
        cash_drawer = self.get_object(pk)
        if cash_drawer:
            cash_drawer.delete()
            return Response("Cash Drawer deleted", status=status.HTTP_204_NO_CONTENT)
        return Response('Cash Drawer does not exist')
    
## APIs FOR CASH RECONCILITION


class CashReconciliationListCreateAPIView(APIView):
    """
        APIView (GET): GET ALL CASH RECONCS
    """
    
    def get(self, request):
        cash_reconciliations = CashReconciliation.objects.all()
        serializer = CashReconciliationSerializer(cash_reconciliations,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    """
    POST METHOD: To create a new cash reconcialiation instance
    """
    
    def post(self, request):
        serializer = CashReconciliationSerializer(data = request.data)
        actual_cash_count = request.data.get('actual_cash_count')
        with transaction.atomic():
            if serializer.is_valid():
                serializer.save(tenant = request.user.tenant)
                ActivityLogs.objects.create(
                                    tenant=request.user.tenant,
                                    action_type='cash_recon_created',
                                    message=f'Cash reconciliation of {actual_cash_count} for  this cash drawer has been recorded.'
                            )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class CashReconciliationRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get a single instance of a cash recon from our schema
    """
    
    def get_object(self, pk):
        return get_object_or_404(CashReconciliation, pk=pk)
    
    """
    GET METHOD: To get a particulat instace by its ID
    """
    
    def get(self, request,pk):
        cash_reconciliation = self.get_object(pk)
        if  not cash_reconciliation:
            return Response('Cash reconcilaition does not exist', status=status.HTTP_404_NOT_FOUND)
        serializer = CashReconciliationSerializer(cash_reconciliation)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    """
    PUT METHOD: To update a instance of a cash recon using its ID
    """
    
    def put(self, request, pk):
        cash_reconciliation = self.get_object(pk)
        serializer = CashReconciliationSerializer(cash_reconciliation, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    
    """
    DELETE METHOD: To dlete a single cash recon instance by its ID
    """
    
    def delete(self,pk):
        cash_reconciliation = self.get_object(pk)
        if not cash_reconciliation:
            return Response("Cash Reconcilaition does not exist", status = status.HTTP_404_NOT_FOUND)
        cash_reconciliation.delete()
        return Response("Cash reconciliation deleted", status=status.HTTP_204_NO_CONTENT)
    
    
    
# APIs for cash expense

class CashExpenseListCreateAPIView(APIView):
    
    
    """
    GET METHOD: To get all cash expenses in our schema
    """
    
    def get(elf, request):
        cash_expense = CashExpense.objects.all()
        serializer = CashExpenseSerializer(cash_expense,many =True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    
    """
    POST METHOD: To create a new cash expense
    """
    
    def post(self, request):
        amount = request.data.get('amount')
        serializer = CashExpenseSerializer(data = request.data)
        with transaction.atomic():
            if serializer.is_valid():
                serializer.save(tenant = request.user.tenant)
                ActivityLogs.objects.create(
                                    tenant=request.user.tenant,
                                    action_type='cash_expense_created',
                                    message=f'Cash expense of {amount}  has been recorded.'
                            )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
class CashExpenseRetrieveUpdateDestroyAPIView(APIView):
    
    """
    helper method to get a single instance of a cash expense using its ID
    """
    
    def get_object(self, pk):
        return get_object_or_404(CashExpense, pk=pk)
    
    """
    PUT METHOD: To update an existing cash expense with its ID
    """
    
    def put(self, request,pk):
        cash_expense = self.get_object(pk)
        serializer = CashExpenseSerializer(cash_expense, data= request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    """
    DELETE METHOD:To delete a particular cash expense
    """
    
    def delete(self, pk):
        cash_expense = self.get_object(pk)
        if not cash_expense:
            return Response('Cash Expense does not exist', status=status.HTTP_404_NOT_FOUND)
        cash_expense.delete()
        return Response('Cash expense deleted succssfully', status=status.HTTP_204_NO_CONTENT)
        
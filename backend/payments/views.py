from django.shortcuts import render
import uuid
import datetime
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import * 
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
import json
import os
from django.http import JsonResponse
import requests
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum
import logging
from rest_framework.permissions import AllowAny, IsAuthenticated
from dotenv import load_dotenv
import os


class STKPushAPIView(APIView):
    
    permission_classes = [AllowAny]
    authentication_classes = []
    
    @staticmethod
    def get_access_token():
        consumer_key = os.getenv("MPESA_CONSUMER_KEY")
        consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")

        if not consumer_key or not consumer_secret:
            raise Exception("M-Pesa consumer key or secret not found in environment variables")

        url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        try:
            encoded_credentials = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()
            headers = {
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/json"
            }
            response = requests.get(url, headers=headers).json()
            print(response) 
            if "access_token" in response:
                return response["access_token"]
            else:
                raise Exception("Failed to get M-Pesa access token: " + response.get("error_description", "Unknown error"))
        except Exception as e:
            raise Exception("Failed to get M-Pesa access token: " + str(e))

    def post(self, request):
        try:
            user_id = request.data.get('user_id')
            print('User...', user_id)
            phone = request.data.get('phone_number')
            
            if not user_id:
                return Response({'error': 'invalid user'}, status=status.HTTP_400_BAD_REQUEST)
            
            NGROK_BASE_URL = "https://fbb4-102-219-210-106.ngrok-free.app"
            access_token = self.get_access_token()
            headers = {"Authorization": f"Bearer {access_token}"}
            timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            business_short_code = os.getenv("MPESA_BUSINESS_SHORT_CODE")
            pass_key = os.getenv("MPESA_PASS_KEY")

            if not business_short_code or not pass_key:
                raise Exception("M-Pesa business short code or pass key not found in environment variables")

            phone_number = request.data.get('phone_number')
            amount = request.data.get('amount')

            if not phone_number or not amount:
                return Response({'error': 'Phone number and amount are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            web_name = "M-FARM"
            stk_password = base64.b64encode((business_short_code + pass_key + timestamp).encode('utf-8')).decode('utf-8')

            print("stk coming....", request.data)
            payload = {
                "BusinessShortCode": business_short_code,
                "Password": stk_password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone_number,
                "PartyB": business_short_code,
                "PhoneNumber": phone_number,
                "CallBackURL": f"{NGROK_BASE_URL}/payments/api/v1/mpesa/callback/",
                "AccountReference": web_name,
                "TransactionDesc": "Payment of a product",
            }

            response = requests.post(
                "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                headers=headers,
                json=payload,
            )

            # Assign to response_json for consistent access
            response_json = response.json()
            print(f"M-Pesa STK Push API response: {response_json}")

            if response.status_code == 200:
                if response_json.get('ResponseCode') == '0':
                    payment = Payments(
                        user_id=user_id,
                        amount=amount,
                        status='pending',
                        transaction_id=response_json.get('CheckoutRequestID', str(uuid.uuid4()))
                    )
                    payment.save()
                    return Response(response_json)
                else:
                    return Response({'error': response_json.get('ResponseDescription', 'M-Pesa API error'), 'details': response_json}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Failed to initiate STK Push with M-Pesa API', 'details': response_json}, status=response.status_code)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
        except requests.exceptions.RequestException as e:
            print(f"Network error during M-Pesa STK push: {e}")
            return JsonResponse({'error': f'Network error communicating with M-Pesa: {e}'}, status=500)
        except Exception as e:
            print(f"Unhandled error in stkpush: {e}")
            return JsonResponse({'error': f'Internal server error: {e}'}, status=500)

from django.shortcuts import render
from rest_framework import generics, status
from .serializers import requestSerializer
from .models import SimulationRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
import time
import uuid 
from django.http import HttpResponse
# ---write endpoints here---

### authentication endpoints ###

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
import json

from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework import generics

# statistics utilities
from . import demogorgn_backend
import datetime 
import os
import base64

SITE_ROOT = os.path.dirname(os.path.realpath(__file__))

import logging

logger = logging.getLogger(__name__)
#logger.info(f"CORS_ALLOW_ALL_ORIGINS: {settings.CORS_ALLOW_ALL_ORIGINS}")

class ListUserSimulationsView(APIView):
    # Ensure only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filter SimulationRequest objects by the authenticated user
        user_simulations = SimulationRequest.objects.filter(user=request.user)

        # Serialize the queryset
        serializer = requestSerializer(user_simulations, many=True)

        # Return the serialized data
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in.'})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})


class SessionView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})


class WhoAmIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'username': request.user.username, 'email': request.user.email})

class listView(generics.ListAPIView):
    queryset = SimulationRequest.objects.all()
    serializer_class = requestSerializer
    
class requestView(generics.CreateAPIView):
    queryset = SimulationRequest.objects.all()
    serializer_class = requestSerializer


### Simulation api endpoints ###

class CreateSimulationView(APIView):
    serializer_class = requestSerializer

    def post(self, request, format="None"):
        serializer = self.serializer_class(data=request.data)
        
        # TODO: Add error handling for type mismatches, etc.
        maxx = float(serializer.initial_data['maxx'])
        maxy = float(serializer.initial_data['maxy'])
        minx = float(serializer.initial_data['minx'])
        miny = float(serializer.initial_data['miny'])
        cellSize = int(serializer.initial_data['cellSize']) # Resolution
        realizations = int(serializer.initial_data['realizations'])
        email = serializer.initial_data['email']
        user = User.objects.get(id=request.user.id)
        # saves simulation request
        
        guid = str(uuid.uuid4())
  
        print("received this email request", email)
        # TODO: Hard coding K and Rad values for now - figure out long term solution
        #k = 100
        #rad = 50000
        
        #statUtil.cosim_mm1(minx=minx,maxx=maxx,miny=miny,maxy=maxy,res=cellSize,sim_num=realizations,k=k,rad=rad)
        demogorgn_backend.simulate(None,None,None,None,cellSize,realizations,guid)
        req = SimulationRequest(user=user, maxx=maxx, maxy=maxy, minx=minx, miny=miny, cellSize=cellSize, realizations=realizations, email=email, guid=guid)
        req.save()

        # TODO SETUP USER so THIS PASSES
        # if serializer.is_valid():
        #     maxx = serializer.data['maxx']
        #     maxy = serializer.data['maxy']
        #     minx = serializer.data['minx']
        #     miny = serializer.data['miny']
        #     cellSize = serializer.data['cellSize']
        #     realizations = serializer.data['realizations']
        #     email = serializer.data['email']

        #     # currently hardcoded user TODO
        #     user = User.objects.get(id=1)
        #     # saves current request into db
        #     req = SimulationRequest(user=user, maxx=maxx, maxy=maxy, minx=minx, miny=miny, cellSize=cellSize, realizations=realizations, email=email)
        #     req.save()

        #     print(serializer.data)
        #     print("TEST POST backend")
        return Response(serializer.initial_data)
    
class SimulationImageEndpoint(APIView):
    # Ensure only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request, guid, realization):
        try:
            # Query for the SimulationRequest object with the provided GUID for the authenticated user
            simulation_request = SimulationRequest.objects.get(user=request.user, guid=guid)
            
            maxRealization = simulation_request.realizations-1
            
            if realization > maxRealization or realization < 0:
                return Response({"error": "Invalid Realization Number"}, status=status.HTTP_404_NOT_FOUND)
            
            # Construct the path to the PNG file (you may need to adjust this based on your actual directory structure)
            #png_path = os.path.join(SITE_ROOT, f"{guid}/{realization}.png")
            png_path = os.path.join(SITE_ROOT, "output")
            png_path = os.path.join(png_path, f"{guid}")
            png_path = os.path.join(png_path,str(realization))
            png_path = os.path.join(png_path,"plot.png")
            
            # Check if the PNG file exists
            if not os.path.exists(png_path):
                return Response({"error": "PNG file not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Read the PNG file and convert it to a base64 encoded string
            with open(png_path, "rb") as png_file:
                base64_encoded_png = base64.b64encode(png_file.read()).decode("utf-8")
            
            # Return the base64 encoded string as the response
            return Response({"base64_image": base64_encoded_png})

        except SimulationRequest.DoesNotExist:
            return Response({"error": "Simulation request not found"}, status=status.HTTP_404_NOT_FOUND)
        
class SimulationCSVEndpoint(APIView):
    # Ensure only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request, guid, realization):
        try:
            # Query for the SimulationRequest object with the provided GUID for the authenticated user
            simulation_request = SimulationRequest.objects.get(user=request.user, guid=guid)
            
            maxRealization = simulation_request.realizations-1
            
            if realization > maxRealization or realization < 0:
                return Response({"error": "Invalid Realization Number"}, status=status.HTTP_404_NOT_FOUND)
            
            # Construct the path to the CSV file (this needs adjustment based on the actual directory structure)
            csv_path = os.path.join(SITE_ROOT, "output", f"{guid}", str(realization), "sim.csv")
            
            # Check if the CSV file exists
            if not os.path.exists(csv_path):
                return Response({"error": "CSV file not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Read the CSV file
            with open(csv_path, "r") as csv_file:
                csv_content = csv_file.read()

            # Create the response with CSV content and headers for file download
            response = HttpResponse(csv_content, content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{guid}_{realization}.csv"'
            
            return response

        except SimulationRequest.DoesNotExist:
            return Response({"error": "Simulation request not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
class GetStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guid):
        # Placeholder for logic to get statuses
        # This view will query the sqlite3 database to get statuses for realizations for the given GUID
        # A background thread will continuously be checking SLURM jobs via squeue to update statuses on 5 to 10 second intervals
        requestList = [
            {
                "guid": "abc",
                "rid": 0,
                "timestamp": datetime.datetime.utcnow(),
                "status": "PENDING"
            },
            {
                "guid": "abc",
                "rid": 1,
                "timestamp": datetime.datetime.utcnow(),
                "status": "PROCESSING"
            },
            {
                "guid": "abc",
                "rid": 2,
                "timestamp": datetime.datetime.utcnow(),
                "status": "COMPLETE"
            },      
            {
                "guid": "abc",
                "rid": 3,
                "timestamp": datetime.datetime.utcnow(),
                "status": "COMPLETE"
            },  
            {
                "guid": "abc",
                "rid": 4,
                "timestamp": datetime.datetime.utcnow(),
                "status": "ERROR"
            },  
        ]
        return JsonResponse({'statuses': requestList})

class CancelRealizationGUIDView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, guid):
        # Placeholder for the logic to delete/Cancel a realization request 
        # This will check all job_ids for the given guid and cancel any job_ids that are still running
        # Will return 404 if guid does not exist
        return HttpResponse('Deleted', status=200)

class CancelRealizationGUIDRIDView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, guid, rid):
        # Placeholder for the logic to delete/Cancel a realization request 
        # This will get the job_id for the guid,rid tuple and cancel it if it is still running. 
        # Will return 404 if guid,rid tuple does not exist
        return HttpResponse('Deleted', status=200)

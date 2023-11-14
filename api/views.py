from django.shortcuts import render
from rest_framework import generics, status
from .serializers import requestSerializer
from .models import SimulationRequest
from .models import RealizationsStatuses
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
import time
import uuid 
from django.http import HttpResponse
from django.utils import timezone
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

from django.conf import settings
import subprocess

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
  
        print(f"Starting simulation {guid}")
        # TODO: Hard coding K and Rad values for now - figure out long term solution
        #k = 100
        #rad = 50000
        req = SimulationRequest(user=user, maxx=maxx, maxy=maxy, minx=minx, miny=miny, cellSize=cellSize, realizations=realizations, email=email, guid=guid)
        req.save()
        for x in range(0,realizations):
            realization = RealizationsStatuses(guid = req,status= "PENDING", last_update = timezone.now(), rid = x)
            realization.save()
        #TODO Make this OS call with the appropriate flags, but only when running in devmode 
        #python3 ./scripts/simulate.py --output_dir ./api/output --datafile ./api/data/PIG_data.csv --guid e388f593-9c7d-4dc1-a45c-052e0f54374d --res 200 --num_realizations 2 --num_cpus 12 --dbfile ./db.sqlite3
        script_path = os.path.join(settings.BASE_DIR,'scripts','simulate.py')
        output_path = os.path.join(settings.BASE_DIR,'api','output')
        command_log_path = os.path.join(settings.BASE_DIR,'api','output',guid,'output.log')
        datafile_path = os.path.join(settings.BASE_DIR,'api','data','PIG_DATA.csv')
        dbfile_path = os.path.join(settings.BASE_DIR,'db.sqlite3') 
        
        os.makedirs(os.path.join(settings.BASE_DIR,'api','output',guid))
        if settings.DEV_MODE:
            command = ["python3",script_path,"--output_dir",output_path,"--datafile",datafile_path,"--guid",guid,"--res",str(cellSize),"--num_realizations",str(realizations), "--num_cpus",str(os.cpu_count()),"--dbfile",dbfile_path  ]
            with open(command_log_path,'w') as out_file:
                process = subprocess.Popen(command, stdout=out_file, stderr=out_file, text=True)
        else:
            # Build up an array where each element is a string representing a line from the SLURM job shell script for this request
            slurm_email_account = "kerekovskik@ufl.edu"
            slurm_script_contents = []
            slurm_script_contents.append("#!/bin/sh")
            slurm_script_contents.append("#SBATCH --cpus-per-task=12")
            slurm_script_contents.append("#SBATCH --mem=20gb")
            slurm_script_contents.append("#SBATCH --time=00:30:00")
            slurm_script_contents.append("#SBATCH --job-name=job_test")
            slurm_script_contents.append("#SBATCH --mail-type=ALL")
            slurm_script_contents.append(f"#SBATCH --mail-user={slurm_email_account}")
            slurm_script_contents.append("#SBATCH --output=" + os.path.join(settings.BASE_DIR,'api','output',guid,'serial_%j.out') )
            slurm_script_contents.append("pwd; hostname; date")
            miniconda_interpreter = "/pubapps/emackie/miniconda3/envs/demogorgn_env/bin/python3"
            command = [miniconda_interpreter,script_path,"--output_dir",output_path,"--datafile",datafile_path,"--guid",guid,"--res",str(cellSize),"--num_realizations",str(realizations), "--num_cpus",str(os.cpu_count()),"--dbfile",dbfile_path  ]
            command_str = " ".join(command)
            slurm_script_contents.append(command_str)
            slurm_script_contents.append("date")
            
            # Loop through the array and write out the shell script
            slurm_script_path = os.path.join(settings.BASE_DIR,'api','output',guid,'slurm_script.sh')
            with open(slurm_script_path,"w") as slurm_script:
                
                for line in slurm_script_contents:
                    slurm_script.write(line + "\n")
            # Initiate the SLURM job. The SLURM Job ID will be stored in file at location command_log_path
            with open(command_log_path,'w') as out_file:
                command = ["sbatch",slurm_script_path]
                process = subprocess.Popen(command, stdout=out_file, stderr=out_file, text=True)
        
            
            
            
        #python3 ./scripts/simulate.py --output_dir ./api/output --datafile ./api/data/PIG_data.csv --guid e388f593-9c7d-4dc1-a45c-052e0f54374d --res 200 --num_realizations 2 --num_cpus 12 --dbfile ./db.sqlite3
        #statUtil.cosim_mm1(minx=minx,maxx=maxx,miny=miny,maxy=maxy,res=cellSize,sim_num=realizations,k=k,rad=rad)
        #demogorgn_backend.simulate(None,None,None,None,cellSize,realizations,guid)



        return Response({"guid":guid})
    
class SimulationImageEndpoint(APIView):
    # Ensure only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request, guid, realization):
        try:
            # Query for the SimulationRequest object with the provided GUID for the authenticated user
            simulation_request = SimulationRequest.objects.get(guid=guid)
            
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
            simulation_request = SimulationRequest.objects.get(guid=guid)
            
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
        # Query the RealizationsStatuses model for records matching the given guid
        statuses = RealizationsStatuses.objects.filter(guid=guid)

        # Construct the response list
        response_list = []
        for status in statuses:
            response_list.append({
                "guid": guid,  
                "rid": status.rid,
                "timestamp": timezone.localtime(status.last_update).isoformat(),  # Format as ISO 8601 string
                "status": status.status
            })

        # Return the JsonResponse
        return JsonResponse({'statuses': response_list})

class CancelRealizationGUIDView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, guid):
        # Retrieve all realizations with the given guid
        realizations = RealizationsStatuses.objects.filter(guid=guid)

        if not realizations.exists():
            # If no realizations are found for the guid, return a 404 response
            raise HttpResponse("Realization not found",status=404)

        # Iterate over the realizations and update their status if applicable
        for realization in realizations:
            if realization.status not in ['COMPLETE', 'RUNNING','CANCELLED']:
                realization.status = 'CANCELLED'
                realization.last_update = timezone.now()
                realization.save()

        return HttpResponse('All applicable realizations cancelled', status=200)

class CancelRealizationGUIDRIDView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, guid, rid):
        try:
            # Retrieve the specific realization
            realization = RealizationsStatuses.objects.get(guid=guid, rid=rid)

            # Check if the status is neither 'COMPLETE' nor 'RUNNING'
            if realization.status not in ['COMPLETE', 'RUNNING','CANCELLED']:
                # Update the status to 'CANCELLED'
                realization.status = 'CANCELLED'
                realization.last_update = timezone.now()
                realization.save()
                return HttpResponse('Realization Cancelled', status=200)
            else:
                # If the realization is already 'COMPLETE' or 'RUNNING'
                return HttpResponse('Realization cannot be cancelled', status=400)
        
        except RealizationsStatuses.DoesNotExist:
            # If the guid,rid tuple does not exist, return a 404 response
            raise HttpResponse("Realization not found",status=404)

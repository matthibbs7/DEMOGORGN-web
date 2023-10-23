from django.shortcuts import render
from rest_framework import generics, status
from .serializers import requestSerializer
from .models import SimulationRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
import time
import uuid 

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
from . import demogorgn

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
        demogorgn.simulate(None,None,None,None,cellSize,realizations,guid)
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
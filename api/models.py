from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# Create your models here.
class SimulationRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    minx = models.IntegerField()
    maxx = models.IntegerField()
    miny = models.IntegerField()
    maxy = models.IntegerField()
    cellSize = models.IntegerField()
    realizations = models.IntegerField()
    email = models.EmailField()
    date = models.DateTimeField(auto_now_add=True)
    guid = models.CharField(max_length=255,default='DEFAULT')

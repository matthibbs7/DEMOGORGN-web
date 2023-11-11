from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models.constraints import UniqueConstraint
from django.utils import timezone


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
    guid = models.CharField(max_length=255, unique=True, default='DEFAULT')


class RealizationsStatuses(models.Model):
    guid = models.ForeignKey(SimulationRequest, on_delete=models.CASCADE, to_field='guid', db_column='guid')
    rid = models.IntegerField()
    status = models.CharField(max_length=255, default='PENDING')
    last_update = models.DateTimeField(default=timezone.now) 
    
    class Meta:
        db_table = "realization_statuses"
        constraints = [
            UniqueConstraint(fields=['guid', 'rid'], name='unique_guid_rid')
        ]
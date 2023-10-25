from rest_framework import serializers
from .models import SimulationRequest



# take simulationRequest model, translate into json response
class requestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationRequest
        fields = ('id', 'user', 'minx', 'maxx', 'miny', 'maxy', 'cellSize', 'realizations', 'email', 'date','guid')

# user model (for registration/login)

from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )

        
        user.set_password(validated_data['password'])
        user.save()

        return user

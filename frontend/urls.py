from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('simulate', index),
    path('auth', index),
    path('auth2', index),
    path('methodology', index),
    path('profile', index),
    path('about', index)
]
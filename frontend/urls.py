from django.urls import path
from .views import index
from django.urls import re_path

urlpatterns = [
    path('', index),
    path('simulate', index),
    path('auth', index),
    path('auth2', index),
    path('methodology', index),
    path('profile', index),
    path('history', index),
    path(r'request.*', index),
    path('about', index),
    re_path(r'.*', index),
]
"""
WSGI config for demogorgn project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os
import logging
from django.core.wsgi import get_wsgi_application
#import demogorgn.settings 
logger = logging.getLogger(__name__)
os.environ["DJANGO_SETTINGS_MODULE"] = 'demogorgn.settings'
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'demogorgn.settings')
from django.conf import settings
print(f"INSTALLED_APPS: {settings.INSTALLED_APPS}")
print(f"MIDDLEWARE: {settings.MIDDLEWARE}")
#print(f"CORS_ALLOWED_ORIGINS: {settings.CORS_ALLOWED_ORIGINS}")
#print(f"CORS_ORIGIN_WHITELIST: {settings.CORS_ORIGIN_WHITELIST}")

application = get_wsgi_application()

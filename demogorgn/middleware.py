
from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        print(f"Request Headers: {request.headers}")
        logger.info(f"Request Headers: {request.headers}")

        response = self.get_response(request)
        print(f"Response Headers: {response.headers}")
        logger.info(f"Response Headers: {response.headers}")
        # Code to be executed for each request/response after
        # the view is called.

        return response

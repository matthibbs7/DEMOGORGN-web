from django.urls import path
from .views import listView, requestView, CreateSimulationView, RegisterView, ListUserSimulationsView, SimulationImageEndpoint, SimulationCSVEndpoint, LookupRequestView
from . import views
# if we get blank url, call main function

urlpatterns = [
    path('all', listView.as_view()),
    path('post', requestView.as_view()),
    path('simulate', CreateSimulationView.as_view()),
    # authentication api endpoints
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.SessionView.as_view(), name='api-session'),  # new
    path('whoami/', views.WhoAmIView.as_view(), name='api-whoami'),  # new
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('user_simulations/', ListUserSimulationsView.as_view(), name='user_simulations'),
    path('simulation-image/<str:guid>/<int:realization>/', SimulationImageEndpoint.as_view(), name='simulation-image'),
    path('simulation-csv/<str:guid>/<int:realization>/', SimulationCSVEndpoint.as_view(), name='simulation-csv'),
    path('get_status/<str:guid>/', views.GetStatusView.as_view(), name='get_status'),
    path('cancel_realization/<str:guid>/', views.CancelRealizationGUIDView.as_view(), name='cancel_realization_guid'),
    path('cancel_realization/<str:guid>/<int:rid>/', views.CancelRealizationGUIDRIDView.as_view(), name='cancel_realization_guid_rid'),
    path('lookup_request/<str:guid>/', LookupRequestView.as_view(), name='lookup_request'),
]
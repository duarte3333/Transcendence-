from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/<str:scope_type>/<str:scope_id>/', consumers.GenericConsumer.as_asgi()),
]

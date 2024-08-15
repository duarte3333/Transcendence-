from django.urls import path
from core.consumers import GenericConsumer

websocket_urlpatterns = [
    path('ws/', GenericConsumer.as_asgi()),
]

from django.urls import path
from core.consumers import GenericConsumer

websocket_urlpatterns = [
    path('ws/chat/general/', GenericConsumer.as_asgi()),
]

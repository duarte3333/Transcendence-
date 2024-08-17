from django.urls import path
from core.GameConsumer import GameConsumer
from core.consumers import GenericConsumer

websocket_urlpatterns = [
    path('ws/', GenericConsumer.as_asgi()),
    path('ws/game/<str:room_name>/', GameConsumer.as_asgi()),
]

from django.urls import path, re_path
from core.GameConsumer import GameConsumer
from core.consumers import GenericConsumer
from core.consumers import ChatConsumer


websocket_urlpatterns = [
    path('ws/', GenericConsumer.as_asgi()),
    path('ws/game/<str:room_name>/', GameConsumer.as_asgi()),
    re_path(r'^ws/(?P<username>\w+)/$', ChatConsumer.as_asgi()),
]

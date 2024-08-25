from django.urls import path, re_path
from core.GameConsumer import GameConsumer
from chat.ChatConsumer import ChatConsumer

websocket_urlpatterns = [
    path('ws/game/<str:room_name>/', GameConsumer.as_asgi()),
    re_path(r'^ws/chat/(?P<user_id>\d+)/$', ChatConsumer.as_asgi()),
]

from django.urls import path, re_path
from core.GameConsumer import GameConsumer
from chat.ChatConsumer import ChatConsumer

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<user_id>\d+)/$', ChatConsumer.as_asgi()),
    # path('wss/', GenericConsumer.as_asgi()),
    path('wss/game/<str:room_name>/', GameConsumer.as_asgi()),
]

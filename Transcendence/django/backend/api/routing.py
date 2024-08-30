from django.urls import re_path
from core.GameConsumer import GameConsumer
from chat.ChatConsumer import ChatConsumer
from chat.TournamentConsumer import TournamentConsumer

websocket_urlpatterns = [
    # re_path(r'^wss/game/(?P<room_name>[\w-]+)/$', GameConsumer.as_asgi()),
    re_path(r'^wss/game/(?P<room_name>[\w-]+)/(?P<playerId>[\w-]+)/$', GameConsumer.as_asgi()),
    re_path(r'^wss/chat/(?P<user_id>\d+)/$', ChatConsumer.as_asgi()),
    re_path(r'^wss/tournament/(?P<user_id>\d+)/$', TournamentConsumer.as_asgi()),
]

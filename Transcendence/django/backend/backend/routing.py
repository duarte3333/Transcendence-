from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter


websocket_urlpatterns = [
    re_path(r'ws/some_path/$', ChatConsumer.as_asgi()),
]
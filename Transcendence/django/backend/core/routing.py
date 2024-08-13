from django.urls import re_path
from core.consumers import GenericConsumer

websocket_urlpatterns = [
    re_path(r'^ws/(?P<username>\w+)/$', GenericConsumer.as_asgi()),
]

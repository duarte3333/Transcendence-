from django.db import models
from django.utils import timezone
import json

class Chat(models.Model):
    user = models.JSONField(default=list)
    status = models.CharField(max_length=255)
    block = models.JSONField(default=list)
    name = models.CharField(max_length=400, default='Default Chat Name')
    mensagens = models.JSONField(default=list)
    createDate = models.DateField(default=timezone.now)

    def create(self, users, name="", status='pending', block=None, mensagens=None, **extra_fields):
        chat = Chat(
            user=users,
            status=status,
            block=block or [],
            name=name,
            mensagens=mensagens or [],
            **extra_fields
        )
        chat.save(using=self._state.db)
        return chat
    
    def list(self, status=None, user_id=None, name=None):
        chats = Chat.objects.exclude(status='deleted')
        if status:
            chats = chats.filter(status=status)
        if name:
            chats = chats.filter(name=name)
        if user_id and user_id != "0":
            user_id = str(user_id)
            chats = [
                chat for chat in chats 
                if any(str(u) == user_id or (isinstance(u, dict) and str(u.get('id')) == user_id) 
                       for u in chat.user)
            ]
        return [chat.to_json() for chat in chats]
    
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'block': self.block,
            'user': self.user,
            'mensagens': self.mensagens,
            'createDate': self.createDate.strftime('%Y-%m-%d %H:%M:%S'), 
        }

    def __str__(self):
        return f"{self.status} - {self.status}"

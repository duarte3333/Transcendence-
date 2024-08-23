import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        self.group_name = f'chat_{self.username}'

        # Adiciona o usuário ao grupo pessoal
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'name': self.username
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        hash_value = text_data_json.get('hash')

        if message_type == 'chat_message':
            await self.handle_chat_message(text_data_json, hash_value)  

    async def handle_chat_message(self, data, hash_value):
        if hash_value in self.blocked_chats:
            await self.send(text_data=json.dumps({
                'error': 'This conversation is blocked.'
            }))
        else:    
            message = data.get('message')
            sender = data.get('sender')
            receiver = data.get('receiver')

            # Enviar a mensagem para o grupo do destinatário
            await self.channel_layer.group_send(
                f'chat_{receiver}',
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': sender,
                    'receiver': receiver,
                    'hash': hash_value
                }
            )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        receiver = event['receiver']
        hash_value = event['hash']

        # Enviar a mensagem para o WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'sender': sender,
            'receiver': receiver,
            'hash': hash_value
        }))
    #

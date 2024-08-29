import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from datetime import datetime

logger = logging.getLogger(__name__)

class TournamentConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # logger.info(f'WebSocket connected: {self.channel_name}')
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = 'chat_0'
        self.channelName = None
        self.messages = []
        # logger.info(f'{self.user_id}')
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.update_model({
            'userId': self.user_id,
            'status': 'online'
        })

        await self.accept()

    async def disconnect(self, close_code):
        # await self.update_model({
        #     'userId': self.user_id,
        #     'status': 'offline'
        # })
        
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def update_model(self, text_data):
        pass
    
    async def receive_json(self, text_data):
        # logger.info(f'Received WebSocket message: {text_data} ch: {self.channelName}')
        action = text_data.get('action')
        
        if action == 'join':
            await self.join_chat(text_data)
        elif action == 'tournament_call':
            await self.tournament_calls(text_data)
        elif action == 'tournament_join':
            await self.tournament_joins(text_data)
        else:
            logger.warning(f'Unknown action received: {action}')

    async def tournament_calls(self, event):
        self.message = event.get('message')
        # logger.info(f"Sending message to frontend: {self.message}")

        # Send the message back directly to the WebSocket client
        await self.send_json({
            'type': 'tournament_call',
            'action': 'tournament_call',
            'message': self.message,
            'userId': event.get('userId'),
        })

    async def tournament_join(self, event):
        await self.send_json({
            'type': 'message_join',
            'action': 'tournament_join',
            'message': self.messages,
            'channelId': self.channelId,
        })
        
    async def tournament_joins(self, event):
        # from chat.models import Chat
        # logger.info(f'join_chat==================== {event}')
        # channel = await sync_to_async(Chat.objects.get)(id=event.get('channelId'))
        self.userId = event.get('userId')
        self.channelId = event.get('channelId')
        

        # logger.info(f'tournment joined {self.userId}')
        
        if self.channelId:
            if self.channelName is not None:
                await self.channel_layer.group_discard(
                    self.channelName,
                    self.channel_name
                )
            self.channelName = 'tournament_' + str(self.channelId)
            
            await self.channel_layer.group_add(
                self.channelName,
                self.channel_name
            )
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'tournament_join',
                    'action': 'tournament_join',
                    'user': self.userId,
                    'message': self.messages,
                    'channelId': self.channelId
                }
            )
            
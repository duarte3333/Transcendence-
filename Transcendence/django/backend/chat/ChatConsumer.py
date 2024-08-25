import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from datetime import datetime

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        logger.info(f'WebSocket connected: {self.channel_name}')
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = 'chat_0'
        self.channelName = None
        logger.info(f'{self.user_id}')
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
        await self.update_model({
            'userId': self.user_id,
            'status': 'offline'
        })
        
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def update_model(self, text_data):
        try:
            user_id = text_data.get('userId')
            new_status = text_data.get('status')
            from login.models import PongUser

            user = await sync_to_async(PongUser.objects.get)(id=user_id)
            user.status = new_status
            await sync_to_async(user.save)()
            # await self.send_json({
            #     'type': 'status_updated',
            #     'action': 'update',
            #     'userId': user_id,
            #     'status': new_status,
            # })
        except Exception as e:
            logger.error(f'Error updating user status: {e}')
    
    async def receive_json(self, text_data):
        logger.info(f'Received WebSocket message: {text_data} ch: {self.channelName}')
        action = text_data.get('action')
        if action == 'join':
            await self.join_chat(text_data)
        elif action == 'chat_message' and (not self.channelName == None):
            await self.chat_messages(text_data)
        elif action == 'block':
            await self.block_users(text_data)
        else:
            logger.warning(f'Unknown action received: {action}')
        
    async def join_chat(self, event):
        from chat.models import Chat
        logger.info(f'join_chat==================== {event}')
        channel = await sync_to_async(Chat.objects.get)(id=event.get('channelId'))
        self.channelId = channel.id
        
        if channel:
            if self.channelName is not None:
                await self.channel_layer.group_discard(
                    self.channelName,
                    self.channel_name
                )
            self.channelName = 'chat_' + str(channel.id)
            
            await self.channel_layer.group_add(
                self.channelName,
                self.channel_name
            )
            
            await self.send_json({
                'type': 'join_message',
                'action': 'join',
                'message': channel.mensagens,
                'channelId': channel.id,
            })
            
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'alertChannelCreated',
                    'action': 'alertChannelCreated',
                    'user': channel.user,
                    'channelId': self.channelId
                }
            )

    async def alertChannelCreated(self, event):
        await self.send_json(
             {
                    'type': 'alertChannelCreated',
                    'action': 'alertChannelCreated',
                    'user': event.get('user'),
                    'channelId': event.get('channelId'),
            }
        )

    async def chat_message(self, event):
        logger.info(f'the message {event}')

        # Enviar a mensagem apenas para o WebSocket, não para o grupo
        await self.send_json({
            'type': 'message',
            'action': 'chat_message',
            'message': event.get('message'),
            'userId': event.get('userId'),
            'channelId': self.channelId
        })

    async def chat_messages(self, event):
        from chat.models import Chat
        channel = await sync_to_async(Chat.objects.get)(id=self.channelId)

        blocked_user_id = event.get('userId')
        is_user_blocked = any(
            block['blocked_user_id'] == blocked_user_id 
            for block in channel.block
        )
        #Check se está a correr bem    
        if is_user_blocked:
            logger.info(f'User {blocked_user_id} is blocked in chat {self.channelId}')
            await self.send_json({
                'type': 'error',
                'action': 'chat_message',
                'channelId': self.channelId
            })
            return

        await self.channel_layer.group_send(
            self.channelName,
            {
                'type': 'chat_message',
                'action': 'chat_message',
                'message': event.get('message'),
                'userId': event.get('userId'),
                'channelId': self.channelId
            }
        )
        
        if (channel):
            channel.mensagens.append({
                'message': event.get('message'),
                'userId': event.get('userId'),
                'createdAt': datetime.now().isoformat()
            })
            await sync_to_async(channel.save)(update_fields=['mensagens'])
     
    async def block_users(self, event):
        logger.info(f'Block {event}')
        self.channelId = event.get('channelId')
        from chat.models import Chat
        try:
            chat = await sync_to_async(Chat.objects.get)(id=self.channelId)

            blocking_user_id = event.get('userId')
            blocked_user_id = event.get('channelId')

            is_already_blocked = any(
                block['blocked_user_id'] == blocked_user_id and 
                block['blocking_user_id'] == blocking_user_id 
                for block in chat.block)
            if not is_already_blocked:
                chat.block.append({
                    'blocking_user_id': blocking_user_id,
                    'blocked_user_id': blocked_user_id
                })
                await sync_to_async(chat.save)(update_fields=['block'])
                logger.info(f'User {blocked_user_id} blocked in chat {self.channelId} by {blocking_user_id}')
            await self.send_json({
                'type': 'block',
                'action': 'block',
                'message': f'User {blocked_user_id} has been blocked by {blocking_user_id}',
                'channelId': self.channelId,
                'blockedUserId': blocked_user_id,
                'blockingUserId': blocking_user_id
            })
        except Chat.DoesNotExist:
            logger.error(f'Chat {self.channelId} does not exist')
            await self.send_json({
                'type': 'error',
                'action': 'block',
                'message': 'Chat does not exist',
            })

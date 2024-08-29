import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from datetime import datetime
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncJsonWebsocketConsumer):
    gameId = None

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


    @database_sync_to_async
    def get_channel(self):
        from chat.models import Chat
        return Chat.objects.get(id=self.channelId)

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
        elif action == 'invite_message':
            await self.invite_messages(text_data)
        elif action == 'block':
            await self.block_users(text_data)
        elif action == 'unblock':
            await self.unblock_users(text_data)
        elif action == 'tournament_join':
            pass
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
    # async def join_chat(self, event):
    #     from chat.models import Chat
    #     logger.info(f'join_chat==================== {event}')
    #     channel = await sync_to_async(Chat.objects.get)(id=event.get('channelId'))
    #     self.channelId = channel.id
        
    #     if channel:
    #         if self.channelName is not None:
    #             await self.channel_layer.group_discard(
    #                 self.channelName,
    #                 self.channel_name
    #             )
    #         self.channelName = 'chat_' + str(channel.id)
            
    #         await self.channel_layer.group_add(
    #             self.channelName,
    #             self.channel_name
    #         )
            
    #         await self.send_json({
    #             'type': 'join_message',
    #             'action': 'join',
    #             'message': channel.mensagens,
    #             'channelId': channel.id,
    #         })
            
    #         await self.channel_layer.group_send(
    #             self.group_name,
    #             {
    #                 'type': 'alertChannelCreated',
    #                 'action': 'alertChannelCreated',
    #                 'user': channel.user,
    #                 'channelId': self.channelId
    #             }
    #         )

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
            'display_name': event.get('display_name'),
            'channelId': self.channelId,
            'block': event.get('block')
        })

    async def invite_message(self, event):
        # channel = await self.get_channel()
        # users = [user['id'] for user in channel.user]
        # game = await self.get_pending_game(users)
        # if game is not None:
        #     gameId = game.id
        # else:
        #     logger.info(f'DEU MERDA AQUI')
        # Enviar a mensagem apenas para o WebSocket, não para o grupo
        await self.send_json({
            'type': 'message',
            'action': 'invite_message',
            'message': event.get('message'),
            'userId': event.get('userId'),
            'display_name': event.get('display_name'),
            'channelId': self.channelId,
            'block': event.get('block'),
            'id': event.get('id')
        })


    @staticmethod
    @database_sync_to_async
    def get_pending_game(users):
        from api.models import Game
        return Game.objects.filter(player=users, status='invite').first()

    async def invite_messages(self, event):
        from chat.models import Chat
        from api.models import Game
        logger.info(f'the message {event}')
        
        channel = await self.get_channel()
        user_id = event.get('userId')
        users = [user['id'] for user in channel.user]
        
        if users is None:
            logger.info(f'Error: Users were not created')
            return

        # Wrap the Game creation in sync_to_async
        try:
            game = await self.get_pending_game(users)
            if game is None:
                game = await sync_to_async(Game.objects.create)(
                    player=[],
                    status='invite',
                    game_type='Normal',
                    playerHost=users[0],
                    numberPlayers=len(users)
                )

            if game is None:
                logger.info(f'Error: Game was not created')
                return

            await self.channel_layer.group_send(
                self.channelName,
                {
                    'type': 'invite_message',
                    'action': 'invite_message',
                    'message': event.get('message'),
                    'userId': event.get('userId'),
                    'channelId': self.channelId,
                    'block': channel.block,
                    'display_name': event.get('display_name'),
                    'id': game.id
                }
            )

            # Add message to channel's messages
            if channel:
                channel.mensagens.append({
                    'message': event.get('message'),
                    'userId': user_id,
                    'createdAt': datetime.now().isoformat(),
                    'display_name': event.get('display_name'),
                    'id': game.id
                })
                await sync_to_async(channel.save)(update_fields=['mensagens'])

        except Exception as e:
            logger.error(f'Error during game creation or message handling: {e}')


    async def chat_messages(self, event):
        from chat.models import Chat
        channel = await sync_to_async(Chat.objects.get)(id=self.channelId)

        user_id = event.get('userId')

        is_user_blocked = any(
            block['userId'] == user_id or block['blocked']['id'] == user_id
            for block in channel.block
        )
        if (is_user_blocked):
            await self.send_json({
                'type': 'error',
                'action': 'me_block',
                'message': 'Chat does not exist',
            })
            return
        
        await self.channel_layer.group_send(
            self.channelName,
            {
                'type': 'chat_message',
                'action': 'chat_message',
                'message': event.get('message'),
                'userId': event.get('userId'),
                'channelId': self.channelId,
                'block': channel.block,
                'display_name': event.get('display_name'),
            }
        )
        
        if channel:
            channel.mensagens.append({
                'message': event.get('message'),
                'userId': user_id,
                'createdAt': datetime.now().isoformat(),
                'display_name': event.get('display_name'),
            })
            await sync_to_async(channel.save)(update_fields=['mensagens'])
     
    async def block_users(self, event):
        from chat.models import Chat
        try:
            chat = await sync_to_async(Chat.objects.get)(id=self.channelId)
            blocker = event.get('userId')
            blocked = event.get('blocked')

            is_already_blocked = any(
                block['userId'] == event.get('userId') 
                for block in chat.block)

            if not is_already_blocked:
                chat.block.append({
                    'userId': blocker,
                    'blocked': blocked
                })
                await sync_to_async(chat.save)(update_fields=['block'])
                await self.send_json({
                    'type': 'block',
                    'action': 'block',
                    'message': f'User {self.channelId} has been blocked by {blocker}',
                    'channelId': self.channelId,
                    'blocked': blocked
                })
        except Chat.DoesNotExist:
            logger.error(f'Chat {self.channelId} does not exist')
            await self.send_json({
                'type': 'error',
                'action': 'block',
                'message': 'Chat does not exist',
            })

    async def unblock_users(self, event):
        from chat.models import Chat
        try:
            chat = await sync_to_async(Chat.objects.get)(id=self.channelId)
            unblocker = event.get('userId')
            unblocked = event.get('unblocked')

            block_to_remove = next((block for block in chat.block if block['userId'] == unblocker and block['blocked']['id'] == unblocked), None)
            # logger.info(f'sfgsdfgsdgsdgdsgdsgdsgfsdg\n\n\n\Seraaaaa block_to_remove {block_to_remove}\n unblocker{unblocker}\n unblocked{unblocked}')

            if block_to_remove:
                chat.block.remove(block_to_remove)
                await sync_to_async(chat.save)(update_fields=['block'])

                await self.send_json({
                    'action': 'unblock',
                    'type': 'unblock',
                    'message': f'User {unblocked} was unblocked by {unblocker}',
                    'channelId': self.channelId,
                    'unblocked': unblocked
                })
        except Chat.DoesNotExist:
            logger.error(f'Chat {self.channelId} does not exist')
            await self.send_json({
                'type': 'error',
                'action': 'unblock',
                'message': 'Chat does not exist',
            })


# myapp/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
# from api.models import Game
import logging

logger = logging.getLogger(__name__)

class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # Adiciona o usuário ao grupo de uma sala de chat específica
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"game_{self.room_name}"

        # Entra na sala do grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Sai da sala do grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive_json(self, content):
        # Handle different types of messages
        message_type = content.get('action')

        # logger.info(f'receive json: {message_type}')
        if message_type == 'join':
            await self.join_game(content)
        elif message_type == 'ball':
            await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'ball_move',
                'x': content.get('x'),
                'y': content.get('y'),
                'visibility': content.get('visibility'),
            }
        )
        elif message_type == 'candy':
            await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'candy',
                'x': content.get('x'),
                'y': content.get('y'),
                'name': content.get('name'),
                'visibility': content.get('visibility'),
            }
        )
        elif message_type == 'up' or message_type == 'down':
            await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'player_move',
                'playerId': content.get('playerId'),
                'move': message_type
            }
        )

    async def ball_move(self, content):
        await self.send_json({
            'type': 'ball_move',
            'action': 'ball',
            'x': content.get('x'),
            'y': content.get('y'),
            'visibility': content.get('visibility'),
        })

        # Add more message types as needed

    async def candy(self, content):
        await self.send_json({
            'type': 'candy',
            'action': 'candy',
            'x': content.get('x'),
            'y': content.get('y'),
            'name': content.get('name'),
            'visibility': content.get('visibility'),
        })

    async def join_game(self, event):
        # Handle the 'join' message type
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'player_joined',
                'playerId': event.get('playerId'),
            }
        )

    async def player_move(self, event):
        await self.send_json({
            'type': 'move',
            'action': "move_" + event.get('move'),
            'move': event.get('move'),
            'playerId': event.get('playerId')
        })
        return

    async def player_running(self, message=None):
        return await self.send_json({
                'type': 'player_running',
                'action': 'running',
                'players': self.game.player,
                'playerHost': self.game.playerHost
        })
    
    async def player_joined(self, event):
        try:
            from api.models import Game

            self.game = await sync_to_async(Game.objects.get)(id=self.room_name)
            player_id = event.get('playerId')
            if not player_id in self.game.player:
                self.game.player.append(player_id)
                max = len(self.game.player)
                if (max == self.game.numberPlayers):
                    self.game.status = "running"
                    await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'player_running',
                    }
                )
                elif (max > self.game.numberPlayers):
                    await self.send_json({
                        'type': 'player_joined',
                        'playerId': player_id,
                        'status': 'error',
                        'room_name': int(self.room_name)
                    })
                await sync_to_async(self.game.save)()
            else:
                self.playerId = player_id
                self.gameId = self.game.id
                await self.player_running()
                return
            self.playerId = player_id
            self.gameId = self.game.id
            await self.send_json({
                'type': 'player_joined',
                'playerId': player_id,
                'gameid': "game.id",
                'status': 'ok'
            })
        except:
            await self.send_json({
            'type': 'player_running',
            'action': 'running',
            })

    async def chat_message(self, event):
        message = event['message']

        # Envia a mensagem para o WebSocket
        await self.send_json({
            'message': message
        })
# myapp/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
# from api.models import Game

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

    # Recebe uma mensagem do WebSocket
    async def receive_json(self, content):
        # Handle different types of messages
        message_type = content.get('action')

        if message_type == 'join':
            await self.join_game(content)
        # Add more message types as needed

    async def join_game(self, content):
        # Handle the 'join' message type
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'player_joined',
                'playerId': content.get('playerId'),
            }
        )

    # Receives a player_joined event from the group
    async def player_joined(self, event):
        try:

            from api.models import Game

            game = await sync_to_async(Game.objects.get)(id=self.room_name)
            game.player.append(event.get("playerId"))
            max = len(game.player)
            if (max == game.numberPlayers):
                game.status = "running"
            elif (max > game.numberPlayers):
                await self.send_json({
                    'type': 'player_joined',
                    'playerId': self.userId,
                    'status': 'error',
                    'room_name': int(self.room_name)
                })
            await sync_to_async(game.save)()
            self.playerId = event.get("playerId")
            self.gameId = game.id
            await self.send_json({
                'type': 'player_joined',
                'playerId': event.get("playerId"),
                'gameid': "game.id",
                'status': 'ok'
            })
        except:
            await self.send_json({
                'type': 'player_joined',
                'playerId': self.userId,
                'status': 'error',
                'room_name': int(self.room_name)
            })

    # Recebe uma mensagem do grupo de sala de chat
    async def chat_message(self, event):
        message = event['message']

        # Envia a mensagem para o WebSocket
        await self.send_json({
            'message': message
        })

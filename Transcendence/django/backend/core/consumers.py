import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from chat.consumers import ChatConsumer

logger = logging.getLogger(__name__)

class GenericConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # self.scope_type = self.scope["url_route"]["kwargs"]["scope_type"]
        # self.scope_id = self.scope["url_route"]["kwargs"]["scope_id"]
        # self.group_name = f'{self.scope_type}_{self.scope_id}'
        self.user = self.scope["user"]
        self.scope_type = 'chat'
        self.group_name = 'math_1'

        await self.channel_layer.group_add (
                self.group_name,
                self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'name': self.channel_name
        }))

        logger.info(f'WebSocket connection accepted for {str(self.user)}')

        # if self.user.is_authenticated:
        #     await self.channel_layer.group_add(
        #         self.group_name,
        #         self.channel_name
        #     )
        #     await self.accept()
        #     logger.info(f'WebSocket connection accepted for {self.user.username}')
        # else:
        #     self.close()
        #     logger.warning('WebSocket connection closed due to unauthenticated user')
    #

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        logger.info(f'WebSocket connection closed for {str(self.user)}')
    #

    async def receive(self, text_data):
        logger.info(f'Received message: {text_data}')
        print(f'Received message: {text_data}')
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        if message_type == 'chat':
            # await ChatConsumer().receive(text_data)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message',
                    'message': text_data_json.get('message'),
                    'sender': text_data_json.get('sender')
                }
            )
        elif message_type == 'room_info':
            num_players = text_data_json.get('numplayers')
            players = text_data_json.get('players')
            await self.handle_group_message(num_players, players)
        #elif message_type == 'game_GameConsumermove':
            #await ().receive(text_data)
        #elif message_type == 'game_stats':
            #await handle_game_stats(self, text_data_json)
    #

    async def chat_message(self, event):
        message = event['message']
        sender = event.get('sender')
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'sender': sender
        }))
    #

    async def handle_group_message(self, num_players, players):
        logger.info(f'Handling game message with {num_players} players')
        if num_players == len(players):
            self.players = players
            players_names = ', '.join([player['name'] for player in players])
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'room_info',
                    'message': f'Room created with {players_names}',
                    'players': players
                }
            )
        #
#

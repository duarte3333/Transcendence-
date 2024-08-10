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
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'chat':
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message',
                    'message': text_data_json.get('message'),
                    'sender': text_data_json.get('sender'),''
                    'receiver': text_data_json.get('receiver')
                }
            )
    #

    async def chat_message(self, event):
        message = event['message']
        sender = event.get('sender')
        receiver = event.get('receiver')
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'sender': sender,
            'receiver': receiver
        }))
    #


    # async def receive(self, text_data):
    #     logger.info(f'Received message: {text_data}')
    #     print(f'Received message: {text_data}')
    #     text_data_json = json.loads(text_data)
    #     message_type = text_data_json.get('type')
    #     #
    #     if message_type == 'chat':
    #         # await ChatConsumer().receive(text_data)
    #         await self.channel_layer.group_send(
    #             self.group_name,
    #             {
    #                 'type': 'chat_message',
    #                 'message': text_data_json.get('message'),
    #                 'sender': text_data_json.get('sender')
    #             }
    #         )
    #     elif message_type == 'room_info':
    #         num_players = text_data_json.get('numplayers')
    #         players = text_data_json.get('players')
    #         await self.handle_group_message(num_players, players)
    #     #
    #     elif message_type == 'paddle_update':
    #         await self.channel_layer.group_send(
    #             self.group_name,
    #             {
    #                 'type': 'paddle_update',
    #                 'paddle_x': text_data_json.get('paddle_x'),
    #                 'paddle_y': text_data_json.get('paddle_y'),
    #                 'sender': text_data_json.get('sender')
    #             }
    #         )
    #     #
    #     elif message_type == 'ball_update':
    #         await self.channel_layer.group_send(
    #             self.group_name,
    #             self.group_name,
    #             {
    #                 'type': 'ball_update',
    #                 'ball_x': text_data_json.get('ball_x'),
    #                 'ball_y': text_data_json.get('ball_y'),
    #             }
    #         )
    #     #
    #     #elif message_type == 'game_GameConsumermove':
    #         #await ().receive(text_data)
    #     #elif message_type == 'game_stats':
    #         #await handle_game_stats(self, text_data_json)
    # #


    # async def paddle_update(self, event):
    #     paddle_x = event['paddle_x']
    #     paddle_y = event['paddle_y']
    #     sender = event['sender']
    #     await self.send(text_data=json.dumps({
    #         'type': 'game_update',
    #         'paddle_x': paddle_x,
    #         'paddle_y': paddle_y,
    #         'sender': sender
    #     }))
    # #

    # async def ball_update(self, event):
    #     ball_x = event['ball_x']
    #     ball_y = event['ball_y']
    #     await self.send(text_data=json.dumps({
    #         'type': 'game_update',
    #         'ball_x': ball_x,
    #         'ball_y': ball_y,
    #     }))
    # #

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


#

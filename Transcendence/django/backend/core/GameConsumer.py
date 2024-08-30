# myapp/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
import logging

logger = logging.getLogger(__name__)

class GameConsumer(AsyncJsonWebsocketConsumer):
    playerId = None
    async def connect(self):
        # Adiciona o usuário ao grupo de uma sala de chat específica
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.playerId = self.scope['url_route']['kwargs']['playerId']
        self.room_group_name = f"game_{self.room_name}"
        # logger.info(f'self room name = {self.room_name}')

        # Entra na sala do grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        logger.info(f'\ndisconnect called code ={self.playerId} \n')
        # Sai da sala do grupo
        await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                     'type': 'sendDisconnect',
                     'action': 'disconnect',
                     'playerId': self.playerId,
                    }
                )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def sendDisconnect(self, event):
        logger.info(f'send disconnect event = {event}')
        logger.info(f'self player id >>>>>>> {self.playerId}')
        await self.send_json({
            'type': 'sendDisconnect',
            'action': 'disconnect',
            'playerId': event.get('playerId'),
        })
        return

    # Recebe uma mensagem do WebSocket
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
        elif message_type == 'score_update':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'score_update',
                    'display_name': content.get('display_name'),
                    'score': content.get('score'),
                }
            )
        elif message_type == 'candy_powerup':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'candy_powerup',
                    'action': 'candy_powerup',
                    'player': content.get('player'),
                    'powerup': content.get('powerup'),
                }
            )
        elif message_type == 'pause_game':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'pause_game',
                    'action': 'pause_game',
                    'flag': content.get('flag'),
                }
            )
        elif message_type == 'game_end' and self.game.status == "running":
            await self.game_ends(content)
        elif message_type in ['up', 'down']:
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

    async def pause_game(self, content):
        await self.send_json({
            'type': 'pause_game',
            'action': 'pause_game',
            'flag': content.get('flag'),
        })

        # Add more message types as needed

    async def score_update(self, content):
        await self.send_json({
            'type': 'score',
            'action': 'score_update',
            'display_name': content.get('display_name'),
            'score': content.get('score'),
        })

    async def candy(self, content):
        await self.send_json({
            'type': 'candy',
            'action': 'candy',
            'x': content.get('x'),
            'y': content.get('y'),
            'name': content.get('name'),
            'visibility': content.get('visibility'),
        })

    async def candy_powerup(self, content):
        await self.send_json({
            'type': 'candy_powerup',
            'action': 'candy_powerup',
            'player': content.get('player'),
            'powerup': content.get('powerup'),
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

    async def game_end(self, event):
        await self.send_json({
            'type': 'game_end',
            'action': "game_end",
            'winner': event.get('winner'),
            'score': event.get('score')
        })
        return

    async def game_ends(self, event):
        try:
            from api.models import Game
            self.game = await sync_to_async(Game.objects.get)(id=self.room_name)
            score = event.get('score')

            if self.game and self.game.status == "running":
                self.game.scoreList = score
                self.game.status = "finished"
                self.game.winner = event.get('winner')
                await sync_to_async(self.game.save)()

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {'type': 'game_end'}
                )
            else:
                await self.send_error("Unknown error in game ends")
        except Exception as e:
            logger.error(f"Error in game_ends: {str(e)}")
        

    async def player_running(self, message=None):
        from login.models import PongUser
        player_ids = [int(player) for player in self.game.player]

        # Fetch all PongUser objects corresponding to the player IDs
        players = await sync_to_async(list)(PongUser.objects.filter(id__in=player_ids).values('id', 'display_name'))

        # Create a mapping of player IDs to their display names
        player_mapping = {player['id']: player['display_name'] for player in players}

        # Create a list of display names based on the order of player IDs
        players_displays = [player_mapping[player_id] for player_id in player_ids]

        return await self.send_json({
            'type': 'player_running',
            'action': 'running',
            'players': self.game.player,
            'playerHost': self.game.playerHost,
            'players_displays': players_displays,
        })

    # Receives a player_joined event from the group
    async def player_joined(self, event):
        try:
            from api.models import Game

            self.game = await sync_to_async(Game.objects.get)(id=self.room_name)
            logger.info(f'self game = {self.game}')
            player_id = event.get('playerId')
            logger.info(f'self playerId = {self.playerId}')
            # if self.playerId is None:
            #     self.playerId = player_id
            logger.info(f'self player id = {self.playerId}')
            max_players = len(self.game.player)
            logger.info(f'entered player joined, Pid= {self.playerId}, Game id = {self.game.id}')
            if self.game and player_id not in self.game.player and (self.game.status == "pending" or self.game.status == "invite"):
                logger.info(f'Bateu na 1')
                self.game.player.append(player_id)
                # logger.info(f'\n>>>>>>game players after append: {self.game.player}\n')
                max_players = len(self.game.player)
                if max_players == self.game.numberPlayers:
                    self.game.status = "running"
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'player_running',
                        }
                    )
                elif max_players > self.game.numberPlayers:
                    logger.info(f'Bateu na 2')
                    await self.send_json({
                        'type': 'player_joined',
                        'playerId': player_id,
                        'status': 'error',
                        'room_name': int(self.room_name)
                    })
                await sync_to_async(self.game.save)()
            # elif self.game and player_id in self.game.player and self.game.status == "invite" and self.game.numberPlayers == max_players:
            #     self.gameId = self.game.id
            #     self.game.status = "running"
            #     await self.channel_layer.group_send(
            #             self.room_group_name,
            #             {
            #                 'type': 'player_running',
            #             }
            #         )
            #     await sync_to_async(self.game.save)()
            elif self.game and player_id in self.game.player and not self.game.status == "finished":
                logger.info(f'Bateu na 3')
                self.gameId = self.game.id
                if (self.game.status == "running"):
                    await self.player_running()
                return
            else:
                logger.info(f'Bateu na 4')
                await self.send_json({
                'type': 'error',
                'message': "unknown error"
                })
                return
        except Exception as e:
            logger.error(f"Error in player_joined: {str(e)}")
            await self.send_json({
                'type': 'error',
                'message': str(e)
                })

    async def chat_message(self, event):
        message = event['message']

        # Envia a mensagem para o WebSocket
        await self.send_json({
            'message': message
        })

from django.db import models
from django.utils import timezone
import json

# class GameManager(models.Manager):
#     def create_game(self, players, playerHost, game_type, **extra_fields):
#         game = self.model(
#             player=players,
#             playerHost=playerHost,
#             game_type=game_type,
#             **extra_fields
#         )
#         game.save(using=self._db)
#         return game

class Game(models.Model):
    player = models.JSONField(default=list)
    game_type = models.CharField(max_length=255, blank=False)
    status = models.CharField(max_length=255, default='pending')
    winner = models.CharField(max_length=255, default='null')
    createDate = models.DateField(default=timezone.now)
    scoreList = models.JSONField(default=list)
    playerHost = models.CharField(max_length=255)
    numberPlayers = models.IntegerField(default=2)

    def create(self, players, status, playerHost, game_type, **extra_fields):
        game = Game(
            player=players,
            status=status,
            playerHost=playerHost,
            game_type=game_type,
            **extra_fields
        )
        game.save(using=self._state.db)
        return game
    
    def list(self, status=None, playerId=None, numberPlayers=None):
        games = Game.objects.exclude(status='deleted')
        if status:
            games = games.filter(status=status)
        else:
            games = games.all()
        if numberPlayers:
            games = games.filter(numberPlayers=numberPlayers)
        else:
            games = games.all()
        if playerId and not playerId == "0":
            playerId = str(playerId)  # Converte playerId para string
            games = [
                game for game in games 
                if any(str(player) == playerId or (isinstance(player, dict) and str(player.get('id')) == playerId) 
                       for player in game.player)
            ]
        games_list = []
        for game in games:
            games_list.append(game.toJson())
        return games_list
    
    def toJson(self):
        return {
            'id': self.id,
            'player': self.player,
            'game_type': self.game_type,
            'status': self.status,
            'createDate': self.createDate.strftime('%Y-%m-%d'),  # Formatação da data
            'scoreList': self.scoreList,
            'playerHost': self.playerHost,
            'numberPlayers': self.numberPlayers,
            'winner': self.winner
        }

    def __str__(self):
        return f"{self.game_type} - {self.status}"




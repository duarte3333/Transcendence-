from django.db import models
from django.utils import timezone

class Game(models.Model):
    # Lista de jogadores como JSONField
    player = models.JSONField(default=list)  # Para Django >= 4.0 use `models.JSONField(default=list)`
    
    game_type = models.CharField(max_length=255, blank=False)
    status = models.CharField(max_length=255, default='pending')
    createDate = models.DateField(default=timezone.now)
    
    # Lista de pontuações como JSONField
    scoreList = models.JSONField(default=list)  # Para Django >= 4.0 use `models.JSONField(default=list)`
    
    playerHost = models.CharField(max_length=255)

    # Definindo numberPlayers como IntegerField
    numberPlayers = models.IntegerField(default=2)

    # Método para criar um jogo
    def create(self, players, playerHost, game_type, **extra_fields):
        game = self.model(
            player=players,
            playerHost=playerHost,
            game_type=game_type,
            **extra_fields
        )
        game.save(using=self._db)
        return game

    def __str__(self):
        return f"{self.game_type} - {self.status}"

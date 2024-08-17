from django.db import models

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

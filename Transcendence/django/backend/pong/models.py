from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50, unique=True)
    Password = models.CharField(max_length=50)

    def __str__(self):
        return self.name
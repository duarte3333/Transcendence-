from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import PongUserManager

class PongUser(AbstractUser):
    display_name = models.CharField(max_length=255, blank=False, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    banner_picture = models.ImageField(upload_to='banner_pictures/', blank=True, null=True)
    down_key = models.CharField(max_length=10, blank=True, null=True)
    up_key = models.CharField(max_length=10, blank=True, null=True)

    objects = PongUserManager()

    def __str__(self):
        return self.username

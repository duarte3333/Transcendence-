from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from .managers import PongUserManager

class PongUser(AbstractUser):
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[RegexValidator(
            regex=r'^[\w.@+-]+$',
            message='Username must be 150 characters or fewer. Letters, digits and @/./+/-/_ only.',
            code='invalid_username'
        )],
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    display_name = models.CharField(max_length=255, blank=False, null=True)
    profile_picture = models.ImageField(upload_to='static/userImages/', blank=True, null=True, default="/static/pong/img/p1.png")
    banner_picture = models.ImageField(upload_to='static/userImages/', blank=True, null=True, default="/static/pong/img/banner.jpeg")
    down_key = models.CharField(max_length=1, blank=True, null=True)
    up_key = models.CharField(max_length=1, blank=True, null=True)

    email = None
    first_name = None
    last_name = None
    date_joined = None
    last_login = None

    objects = PongUserManager()

    def __str__(self):
        return self.username





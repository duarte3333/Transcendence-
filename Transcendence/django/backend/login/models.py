from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from .managers import PongUserManager
from django.utils import timezone

class PongUser(AbstractUser):
    username = models.CharField(
        max_length=150,
        unique=True,
        blank=False,
        null=False,
        validators=[RegexValidator(
            regex=r'^[\w.@+-]+$',
            message='Username must be 150 characters or fewer. Letters, digits and @/./+/-/_ only.',
            code='invalid_username'
        )],
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    display_name = models.CharField(max_length=255, blank=False, null=False)
    profile_picture = models.ImageField(upload_to='static/userImages/', blank=True, null=True, default="static/pong/img/p1.png")
    banner_picture = models.ImageField(upload_to='static/userImages/', blank=True, null=True, default="static/pong/img/banner.jpeg")
    down_key = models.CharField(max_length=255, blank=True, null=True, default='s')
    up_key = models.CharField(max_length=255, blank=True, null=True, default='w')
    friends = models.JSONField(default=list)
    last_seen = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=255, blank=False, default='offline')

    email = None
    first_name = None
    last_name = None
    date_joined = None
    last_login = None

    objects = PongUserManager()

    def update_last_seen(self):
        self.last_seen = timezone.now()
        self.save(update_fields=['last_seen'])

    @staticmethod
    def get_online_users():
        now = timezone.now()
        return PongUser.objects.filter(last_seen__gte=now - ONLINE_THRESHOLD)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'display_name': self.display_name,
            'profile_picture': self.profile_picture.url if self.profile_picture else None,
            'banner_picture': self.banner_picture.url if self.banner_picture else None,
            'up_key': self.up_key if self.up_key else 'w',
            'down_key': self.down_key if self.down_key else 's',
            'status': self.status,
        }

    def __str__(self):
        return self.username





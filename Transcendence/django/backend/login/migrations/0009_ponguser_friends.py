# Generated by Django 4.2.15 on 2024-08-19 14:45

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0008_remove_ponguser_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='ponguser',
            name='friends',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]

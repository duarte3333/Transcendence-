# Generated by Django 4.2.15 on 2024-08-17 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0006_remove_ponguser_email_alter_ponguser_banner_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='ponguser',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True),
        ),
    ]
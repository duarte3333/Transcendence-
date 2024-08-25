from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),  # Depende da migração inicial
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat',
            name='block',
        ),
    ]

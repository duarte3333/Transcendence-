#!/bin/sh

python manage.py makemigrations
python manage.py migrate --no-input

# Ensure Django settings are configured and then create the superuser if none exists
python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Replace 'backend.settings' with your settings module
django.setup()
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(username=os.environ.get('DJANGO_ADMIN'), password=os.environ.get('DJANGO_ADMIN_PASS'), display_name=os.environ.get('DJANGO_ADMIN_DISPLAY'))
"

# Comment the following line to run the server in production
# python manage.py runserver 0.0.0.0:8000

# Run Daphne server
daphne -b 0.0.0.0 -p 8000 backend.asgi:application

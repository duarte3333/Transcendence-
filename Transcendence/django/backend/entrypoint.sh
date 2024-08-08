#!/bin/sh

# Optional delay
sleep 5

python manage.py makemigrations pong
python manage.py migrate --no-input
python manage.py collectstatic --no-input

#comment the following line to run the server in production
# python manage.py runserver 0.0.0.0:8000

# Start Daphne for ASGI (WebSockets and HTTP requests)
daphne -b 0.0.0.0 -p 8000 backend.asgi:application
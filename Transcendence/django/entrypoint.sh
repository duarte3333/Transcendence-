#!/bin/sh

./wait-for-it.sh db:5432 --

python manage.py makemigrations pong
python manage.py migrate --no-input

#comment the following line to run the server in production
python manage.py runserver 0.0.0.0:8000

# Run Daphne server
# daphne -b 0.0.0.0 -p 8000 backend.asgi:application

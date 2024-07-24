#!/bin/sh

# Optional delay
sleep 5

# Wait for the PostgreSQL service to be ready
./wait-for-it.sh $DATABASE_HOST $DATABASE_PORT -- echo "Postgres is up and running"


python manage.py makemigrations pong
python manage.py migrate --no-input
python manage.py collectstatic --no-input

#comment the following line to run the server in production
python manage.py runserver 0.0.0.0:8000

# uncomment the following line to run the server in production
# gunicorn backend.wsgi:application --bind 0.0.0.0:8000

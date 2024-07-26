FROM python:3.8-slim

RUN apt-get update && apt-get install -y libpq-dev gcc && apt-get clean

RUN pip install --upgrade pip
COPY ./backend/requirements.txt /
RUN pip install -r /requirements.txt

ENV DJANGO_SETTINGS_MODULE=backend.settings

COPY ./backend /app

WORKDIR /app

COPY ./entrypoint.sh /

# Expose the port Daphne will run on
EXPOSE 8000

ENTRYPOINT ["sh", "/entrypoint.sh"]

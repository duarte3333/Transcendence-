FROM python:3.8-slim

RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

RUN pip install --upgrade pip
COPY ./backend/requirements.txt /
RUN pip install -r /requirements.txt

COPY ./backend /app

WORKDIR /app

COPY ./backend/entrypoint.sh /
COPY ./backend/wait-for-it.sh /

RUN chmod +x /entrypoint.sh /wait-for-it.sh

# Install Daphne
RUN pip install daphne

ENTRYPOINT ["sh", "/entrypoint.sh"]

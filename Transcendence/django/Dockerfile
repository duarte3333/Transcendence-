FROM python:3.8-slim

# Install necessary packages including netcat-openbsd
RUN apt-get update && \
    apt-get install -y libpq-dev gcc netcat-openbsd && \
    apt-get clean

RUN mkdir /app
WORKDIR /app

RUN pip install --upgrade pip

COPY requirements.txt /app/
RUN pip install -r requirements.txt

COPY ./entrypoint.sh /
COPY ./wait-for-it.sh /

RUN chmod +x /entrypoint.sh

EXPOSE 8000

CMD ["sh", "/entrypoint.sh"]

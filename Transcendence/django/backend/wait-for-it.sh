#!/bin/sh

# wait-for-it.sh
# Use this script to test if a given TCP host/port are available

TIMEOUT=15
HOST=$1
PORT=$2

until nc -z -v -w $TIMEOUT $HOST $PORT
do
  echo "Waiting for $HOST:$PORT to be available..."
  sleep 1
done

echo "$HOST:$PORT is available"
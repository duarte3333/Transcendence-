#!/bin/sh

# wait-for-it.sh
# Use this script to test if a given TCP host/port are available

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 1
done

echo "$host:$port is up and running"

echo "$HOST:$PORT is available"

exec $cmd

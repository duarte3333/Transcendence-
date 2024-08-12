docker commands:

create a .env file with{
SECRET_KEY
DEBUG
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
}

server up{
    docker-compose up -d --build
}

server down{
    docker-compose down
}

remove all image, containers{
docker stop $(docker ps -q) && docker rm $(docker ps -aq) && docker rmi $(docker images -q)
}

remove everything{
docker system prune -a --volumes
}

restart compose{
docker-compose down --remove-orphans && docker-compose build --no-cache && docker-compose up
}
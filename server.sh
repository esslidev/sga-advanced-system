#! /bin/sh

echo "STOP CONTAINER------------------------------------"
docker container stop sga-backend php-my-admin db_sga sga-advanced-system-sga-backend 2>/dev/null 
wait
docker container rm sga-backend php-my-admin db_sga sga-advanced-system-sga-backend 2>/dev/null 
wait
docker image rm sga-advanced-system-sga-backend 2>/dev/null
echo ""
wait
docker-compose down 
wait
echo "UP DOCKER_COMPOSE---------------------------------"
echo ""
docker-compose up  & disown
echo ""
echo "--------------------------------------------------"

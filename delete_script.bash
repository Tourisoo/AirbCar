docker ps -aq | xargs -r docker rm -f && \
docker images -aq | xargs -r docker rmi -f && \
docker volume ls -q | xargs -r docker volume rm -f && \
docker network ls -q | grep -vE '(^| )bridge|host|none($| )' | xargs -r docker network rm && \
docker system prune -af --volumes


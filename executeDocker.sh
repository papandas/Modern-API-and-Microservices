docker rmi -f $(docker images grpc* -q)

docker-compose up
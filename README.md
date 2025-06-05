# docker network create muze-network

## Gateway Service

```text
docker compose run --rm gateway npm install
docker compose run --rm gateway npm build
```

## User Service

```text
docker compose run --rm user-service npm install
docker compose run --rm user-service npm run build
```
## Product Service

```text
docker compose run --rm product-service npm install
docker compose run --rm product-service npm run build
```


## docker compose up -d --build
## docker compose -f docker-compose.dev.yml up -d --build
## docker compose -f docker-compose.dev.yml down
## sudo rm -rf folder_name

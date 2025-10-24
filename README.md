# E-commerce Microservices Project

This project is a microservices-based e-commerce backend built with:
- **Node.js + TypeScript**
- **Express.js**
- **MongoDB**
- **Kafka (with Zookeeper)**
- **Docker Compose** for orchestration

## 🧠 Architecture Overview

- **API Gateway**: Acts as a reverse proxy to route requests to respective services.
- **User Service**: Handles user registration, login, profile, and authentication (JWT + Google Sign-In).
- **Product Service**: Manages product CRUD and category logic.
- **MongoDB**: Main database.
- **Kafka**: For inter-service event communication.

---

## 🛠️ Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Docker network for services to communicate:

# docker network create ecommerce-net

## Gateway Service

```text
docker compose run --rm gateway npm install
docker compose run --rm gateway npm run build
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

## Cart Service

```text
docker compose run --rm cart-service npm install
docker compose run --rm cart-service npm run build
```
## Order Service

```text
docker compose run --rm order-service npm install
docker compose run --rm order-service npm run build
```

## docker compose up -d --build
## docker compose -f docker-compose.dev.yml up -d --build
## docker compose -f docker-compose.dev.yml down
## sudo rm -rf folder_name

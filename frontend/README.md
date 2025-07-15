# Getting Started with Docker for Next.js

This guide explains how to build and run your Next.js application using Docker.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

## 1. Build the Docker Image

Open a terminal and navigate to the `frontend` directory:

```sh
cd frontend
```

Build the Docker image (replace `my-next-app` with any name you like):

```sh
docker build -t my-next-app .
```

## 2. Run the Docker Container

Run the container, mapping port 3000 from the container to your local machine:

```sh
docker run -p 3000:3000 my-next-app
```

Your Next.js app will be available at [http://localhost:3000](http://localhost:3000).

## 3. Stopping the Container

To stop the running container, press `Ctrl+C` in the terminal where it's running, or list and stop it manually:

```sh
docker ps
# Find the container ID, then:
docker stop <container_id>
```

---

For more advanced setups (multi-service, databases, etc.), consider using Docker Compose.




maya

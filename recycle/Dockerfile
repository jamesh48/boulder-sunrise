# Stage 1: Build Java (Maven) application
FROM maven:3.8.4-openjdk-17-slim AS java-builder
WORKDIR /app
COPY jokes-api /app
RUN mvn clean install

# Stage 2: Build JavaScript (Node.js) application
FROM node:18.17.0-alpine AS js-builder
WORKDIR /app
COPY ./frontend /app
RUN npm install
RUN npm run build

# Stage 3: Final image
FROM openjdk:17-jdk-alpine

WORKDIR /app

# Copy Node
COPY --from=js-builder /usr/lib /usr/lib
COPY --from=js-builder /usr/local/share /usr/local/share
COPY --from=js-builder /usr/local/lib /usr/local/lib
COPY --from=js-builder /usr/local/include /usr/local/include
COPY --from=js-builder /usr/local/bin /usr/local/bin
# Copy built Java application
COPY --from=java-builder /app/target/jokes-api-0.0.1-SNAPSHOT.jar /app
# Copy built JavaScript application
COPY --from=js-builder /app/.next /app/.next
COPY --from=js-builder /app/package.json /app/package.json
COPY --from=js-builder /app/node_modules /app/node_modules

# Copy start script
COPY ./start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8080
EXPOSE 3000

CMD ["/bin/sh", "/app/start.sh"]


# Stage 1: Build Java (Maven) application
FROM maven:3.8.4-openjdk-17-slim AS java-builder
WORKDIR /app
COPY . /app
RUN mvn clean install

# Stage 2: Final image
FROM eclipse-temurin:17-jre

WORKDIR /app
# Copy built Java application
COPY --from=java-builder /app/target/weather-api-0.0.1-SNAPSHOT.jar /app

EXPOSE 8080

CMD ["java", "-jar", "/app/weather-api-0.0.1-SNAPSHOT.jar"]
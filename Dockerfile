# --- Stage 1: Build ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Run ---
FROM alpine/java:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar /app/purrsonal-tracker.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/app/purrsonal-tracker.jar" ]

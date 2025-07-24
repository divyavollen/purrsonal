FROM eclipse-temurin:21-jdk-alpine AS build
RUN apk add --no-cache maven
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests && rm -rf target/*-original.jar src ~/.m2

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar /app/purrsonal-tracker.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/app/purrsonal-tracker.jar" ]

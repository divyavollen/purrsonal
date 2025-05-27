FROM alpine/java:21-jdk
WORKDIR /app
COPY target/*.jar /app/purrsonal-tracker.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/app/purrsonal-tracker.jar" ]

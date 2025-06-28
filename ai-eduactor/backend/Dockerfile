# Use OpenJDK 21
FROM eclipse-temurin:21-jdk
VOLUME /tmp
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

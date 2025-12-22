FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY build/libs/*.jar app.jar
COPY application.yml .
RUN cat application.yml
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

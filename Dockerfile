FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY application.yml .


RUN chmod +x gradlew


COPY src ./src


RUN ./gradlew clean bootJar -x test --no-daemon


FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar
COPY --from=build /app/application.yml .

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

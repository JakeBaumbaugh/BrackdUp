FROM gradle:8.4-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon

FROM openjdk:17

RUN mkdir /app
COPY --from=build /home/gradle/src/build/libs/*.jar /app/app.jar

# Any cmd options here
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
# port 3001
# expecting postgres database on 3002
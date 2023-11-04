FROM gradle:8.4-jdk17 AS build
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .
RUN gradle build --no-daemon

#alpine 
FROM eclipse-temurin:17.0.9_9-jre-alpine

RUN mkdir /app
COPY --from=build /home/gradle/src/app/build/libs/app.jar /app/app.jar

# Any cmd options here
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
# port 3001
# expecting postgres database on 3002
FROM gradle:4.5-jdk8-alpine as builder
USER root
WORKDIR /builder
ADD . /builder
RUN gradle build --no-daemon --info --stacktrace

FROM openjdk:8-jre-alpine
WORKDIR /app
EXPOSE 8080
COPY --from=builder /builder/build/libs/server.jar .
CMD ["java", "-jar", "server.jar"]
FROM gradle:latest as builder
USER root
WORKDIR /builder
ADD oid4vc/walt.id/ /builder
RUN gradle build --no-daemon --info --stacktrace

FROM openjdk:latest
WORKDIR /app
EXPOSE 8080
COPY --from=builder /builder/build .
CMD ["java", "-jar", "libs/oid4vc-0.1.jar"]
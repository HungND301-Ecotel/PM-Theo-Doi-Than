FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /app

# Nếu có settings.xml (private repo) thì thêm
# COPY settings.xml /root/.m2/settings.xml

# Copy toàn bộ pom trước
COPY pom.xml .
COPY shared-library/pom.xml ./shared-library/pom.xml
COPY master-data-service/pom.xml ./master-data-service/pom.xml

# Copy source shared-library trước khi install
COPY shared-library/src ./shared-library/src
RUN mvn -B install -pl shared-library -am -DskipTests

# Cache dependency master-data-service
RUN mvn -B dependency:go-offline -pl master-data-service

# Build master-data-service
COPY master-data-service/src ./master-data-service/src
RUN mvn -B package -pl master-data-service -DskipTests

############################
# Stage 2 — Runtime
############################
FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache curl
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

COPY --from=builder /app/master-data-service/target/*.jar app.jar

RUN chown -R spring:spring /app
USER spring

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

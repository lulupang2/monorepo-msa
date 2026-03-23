FROM gradle:8-jdk21-alpine AS builder
WORKDIR /app
# 루트 컨텍스트이므로 경로 지정하여 복사
COPY apps/api-order ./apps/api-order
WORKDIR /app/apps/api-order
# 빌드 (테스트 스킵)
RUN gradle clean build -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# 빌드된 jar 파일 복사
COPY --from=builder /app/apps/api-order/build/libs/*-SNAPSHOT.jar app.jar
EXPOSE 18080
ENTRYPOINT ["java", "-jar", "-Dserver.port=18080", "app.jar"]

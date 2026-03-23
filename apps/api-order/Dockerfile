FROM gradle:8-jdk21-alpine AS builder
WORKDIR /app
COPY . .
# 권한 부여 및 빌드 (테스트 스킵으로 빠른 빌드)
RUN gradle clean build -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# 빌드된 jar 파일 복사 (버전명 무관하게 카피)
COPY --from=builder /app/build/libs/*-SNAPSHOT.jar app.jar
EXPOSE 18080
ENTRYPOINT ["java", "-jar", "-Dserver.port=18080", "app.jar"]

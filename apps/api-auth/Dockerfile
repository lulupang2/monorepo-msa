# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 의존성 정의 파일 복사
COPY package.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/main"]

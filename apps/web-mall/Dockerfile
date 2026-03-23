# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 정의 파일 복사 (npm 사용)
COPY package.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Next.js 빌드 (Standalone 모드 권장)
ENV NEXT_OUTPUT_STANDALONE=true
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# 빌드 결과물 복사 (Standalone 모드 사용 시)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 13001

ENV PORT=13001
# Standalone 실행 시 server.js 파일이 생성됨
CMD ["node", "server.js"]

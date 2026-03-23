# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치 및 전역 환경 설정
RUN npm install -g pnpm

# 모노리포 환경이므로 루트와 패키지 의존성 고려가 필요할 수 있으나, 
# 독립 실행형 빌드를 위해 우선 앱 디렉토리 기준 작성
COPY package.json pnpm-lock.yaml* ./

# 의존성 설치
RUN pnpm install

# 소스 코드 복사
COPY . .

# Next.js 빌드 (Standalone 모드 권장)
ENV NEXT_OUTPUT_STANDALONE=true
RUN pnpm build

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

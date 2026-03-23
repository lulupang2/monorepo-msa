FROM node:20-alpine AS builder
# 터보레포 캐싱 및 빌드
WORKDIR /app
RUN yarn global add pnpm turbo
COPY . .
RUN turbo prune --scope=@mall/api-display --docker

FROM node:20-alpine AS installer
WORKDIR /app
RUN yarn global add pnpm turbo
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN turbo run build --filter=@mall/api-display...

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=installer /app/apps/api-display/dist ./dist
COPY --from=installer /app/apps/api-display/package.json .
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3000
CMD [ "node", "dist/main.js" ]

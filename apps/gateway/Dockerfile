FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune --scope=@mall/gateway --docker

FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=@mall/gateway...

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=installer /app/apps/gateway/dist ./dist
COPY --from=installer /app/apps/gateway/package.json .
COPY --from=installer /app/node_modules ./node_modules
EXPOSE 18001
CMD [ "node", "dist/main.js" ]

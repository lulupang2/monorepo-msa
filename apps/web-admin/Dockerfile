FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune --scope=web-admin --docker

FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=web-admin...

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=installer /app/apps/web-admin/build ./build
COPY --from=installer /app/apps/web-admin/package.json .
COPY --from=installer /app/node_modules ./node_modules
EXPOSE 5173
CMD ["node", "build"]

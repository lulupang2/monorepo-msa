FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune --scope=@mall/web-mall --docker

FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=@mall/web-mall...

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
# Next.js standalone output assumes the root of the project
COPY --from=installer /app/apps/web-mall/.next/standalone ./
COPY --from=installer /app/apps/web-mall/.next/static ./apps/web-mall/.next/static
COPY --from=installer /app/apps/web-mall/public ./apps/web-mall/public
EXPOSE 13001
ENV PORT 13001
CMD ["node", "apps/web-mall/server.js"]

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// @ts-ignore
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 프리플라이트 및 CORS 허용
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 1. 주문/결제 코어 API (Spring Boot - 18080) 라우팅
  app.use(
    '/api/order',
    createProxyMiddleware({
      target: 'http://localhost:18080',
      changeOrigin: true,
    }),
  );

  // 2. 전시/상품 BFF API (NestJS - 13000) 라우팅
  app.use(
    '/api/display',
    createProxyMiddleware({
      target: 'http://localhost:13000',
      changeOrigin: true,
    }),
  );

  // 3. 인증 서비스 (NestJS - 3001) 라우팅
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    }),
  );

  await app.listen(process.env.PORT ?? 14000);
  console.log(`🚀 Gateway is running on: http://localhost:${process.env.PORT ?? 14000}`);
}
bootstrap();

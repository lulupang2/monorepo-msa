"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_proxy_middleware_1 = require("http-proxy-middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use('/api/order', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'http://localhost:18080',
        changeOrigin: true,
    }));
    app.use('/api/display', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'http://localhost:13000',
        changeOrigin: true,
    }));
    app.use('/api/auth', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'http://localhost:3001',
        changeOrigin: true,
    }));
    await app.listen(process.env.PORT ?? 14000);
    console.log(`🚀 Gateway is running on: http://localhost:${process.env.PORT ?? 14000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
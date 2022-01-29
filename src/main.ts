import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/ipfs', createProxyMiddleware({ target: 'http://localhost:8080', changeOrigin: true }));

  app.enableCors();
  await app.listen(3000);
}
bootstrap();

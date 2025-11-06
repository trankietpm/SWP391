import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.use(json({ limit: '50mb' }));
  
  // Serve static files from backend/public folder
  const publicPath = join(process.cwd(), 'public');
  app.useStaticAssets(publicPath, {
    prefix: '/',
  });
  
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3123);
}
bootstrap();

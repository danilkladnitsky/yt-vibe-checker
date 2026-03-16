import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('3.0')
    .build();

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: '/openapi.json',
  });

  const authRoutes = ['/auth/google', '/auth/google/callback'];

  Object.keys(document.paths).forEach((path) => {
    if (authRoutes.includes(path)) {
      delete document.paths[path];
    }
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);

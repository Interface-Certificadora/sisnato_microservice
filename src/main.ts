import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

const port = process.env.PORT || 30002;
const ApiRoute = process.env.API_ROUTE || 'api';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuração para arquivos grandes
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(port).then(() => {
    console.log('');
    console.log(` `);
    console.log(` `);
    console.log(` `);
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Api running on http://localhost:${port}/${ApiRoute}/`);
    console.log(` `);
  });
}
bootstrap();

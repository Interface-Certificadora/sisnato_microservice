import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PrismaClientExceptionFilter } from './prisma/prisma.filter';
import { DiscordExceptionFilter } from './error/error.filter';

async function bootstrap() {
  const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  const queue = process.env.RABBITMQ_QUEUE || 'sisnato';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        // urls: ['amqp://24.152.37.153:5672'],
        urls: [url],
        queue: queue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalFilters(new DiscordExceptionFilter());

  await app.listen();
}
bootstrap();

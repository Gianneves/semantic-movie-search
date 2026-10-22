import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getRabbitMqUrls } from './rabbitmq.config';
import { Logger } from '@nestjs/common';
import { NOTIFICATION_QUEUE } from './constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: getRabbitMqUrls(),
        queue: NOTIFICATION_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();

  Logger.log(
    `init rabbitmq - consumindo a fila "${NOTIFICATION_QUEUE}"`,
    'RabbitMQ',
  );
}
void bootstrap();

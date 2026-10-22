import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/users.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_CLIENT, NOTIFICATION_QUEUE } from '../constants';
import { getRabbitMqUrls } from '../rabbitmq.config';
import { Friends } from './entities/friends.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Friends]),
    ClientsModule.register([
      {
        name: NOTIFICATION_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: getRabbitMqUrls(),
          queue: NOTIFICATION_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}

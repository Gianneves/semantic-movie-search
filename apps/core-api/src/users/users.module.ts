import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Review } from 'apps/core-api/src/review/entities/review.entity';
import { List } from 'apps/core-api/src/list/entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Review, List])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: []
})
export class UsersModule {}

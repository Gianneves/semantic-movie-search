import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Review } from 'src/review/entities/review.entity';
import { List } from 'src/list/entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Review, List])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: []
})
export class UsersModule {}

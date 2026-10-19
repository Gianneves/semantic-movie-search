import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Review } from 'apps/semantic_movie_search/src/review/entities/review.entity';
import { List } from 'apps/semantic_movie_search/src/list/entities/list.entity';
import { Friends } from '../friends/entities/friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Review, List, Friends])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: []
})
export class UsersModule {}

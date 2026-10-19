import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'apps/semantic_movie_search/src/users/entities/users.entity';
import { List } from './entities/list.entity';
import { Movie } from 'apps/semantic_movie_search/src/movie/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, List, Movie])],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService]
})
export class ListModule {}

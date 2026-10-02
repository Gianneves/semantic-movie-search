import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { List } from './entities/list.entity';
import { Movie } from 'src/movie/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, List, Movie])],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService]
})
export class ListModule {}

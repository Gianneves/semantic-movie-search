import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'apps/semantic_movie_search/src/movie/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  providers: [AiService],
  exports: [AiService]
})
export class AiModule {}

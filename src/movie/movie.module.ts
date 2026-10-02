import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { AiModule } from 'src/ai/ai.module';
import { List } from 'src/list/entities/list.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Movie, List]), AiModule],
  providers: [MovieService],
  controllers: [MovieController]
})
export class MovieModule {}

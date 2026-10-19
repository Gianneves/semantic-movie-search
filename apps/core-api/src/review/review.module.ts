import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'apps/core-api/src/movie/entities/movie.entity';
import { Review } from './entities/review.entity';
import { Users } from 'apps/core-api/src/users/entities/users.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Review, Users])
  ],
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}

import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { Review } from './entities/review.entity';
import { Users } from 'src/users/entities/users.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Review, Users])
  ],
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}

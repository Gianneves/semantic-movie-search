import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayload } from 'src/auth/utils/token-payload.interface';
import { Users } from 'src/users/entities/users.entity';
import { Movie } from 'src/movie/entities/movie.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>

    ) {}
    async create(createReview: CreateReviewDto, user: TokenPayload) {

        const userExist = await this.userRepository.findOneBy({
            id: user.userId
        });

        if (!userExist) {
            throw new Error('Usuário não encontrado');
        }

        const movie = await this.movieRepository.findOneBy({
            id: createReview.movie
        });

        if (!movie) {
            throw new Error('Filme não encontrado');
        }

        const review = this.reviewRepository.create({
            ...createReview,
            movie,
            user: userExist,
        });

        return await this.reviewRepository.save(review);
    }

    async getReviews(id: string) {
        const reviews = await this.reviewRepository.find({
            select: {
                user: {
                    id: true,
                    name: true,
                    avatar: true
                },
                movie: {
                    id: true
                }
            },
            relations: {
                user: true,
                movie: true
            },
            where: {
                movie: {
                    id
                }
            },
            take: 10
        });

        return reviews;
    }

    async update() {

    }
}

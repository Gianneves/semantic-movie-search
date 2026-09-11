import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>

    ) { }
    async create(createReview: CreateReviewDto, user: Users) {

        const userExist = await this.userRepository.findOneBy({
            id: user.id
        });

        if (!userExist) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const movie = await this.movieRepository.findOneBy({
            id: createReview.movie
        });

        if (!movie) {
            throw new NotFoundException('Filme não encontrado');
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

    async update(id: string, updateReview: UpdateReviewDto, user: Users) {
        const userExist = await this.userRepository.findOneBy({
            id: user.id
        });

        if (!userExist) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const newReview = await this.reviewRepository.findOne({
            where: { id },
            relations: { user: true }
        });

        if (!newReview) {
            throw new NotFoundException('Review não encontrado');
        }

        if (newReview.user.id !== user.id) {
            throw new ForbiddenException('Você não tem permissão para editar essa review.');
        }

        newReview.rating = updateReview?.rating ?? newReview.rating;
        newReview.review = updateReview?.review ?? newReview.review;

        return await this.reviewRepository.save(newReview);
    }
}

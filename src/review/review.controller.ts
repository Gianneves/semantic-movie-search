import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from 'src/auth/utils/current-user.decorator';
import type { TokenPayload } from 'src/auth/utils/token-payload.interface';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createReviewDto: CreateReviewDto,
        @CurrentUser() user: TokenPayload,
    ) {
        return this.reviewService.create(createReviewDto, user)
    }

    @Get(':id')
    async getReviews(@Param('id') id: string) {
        return this.reviewService.getReviews(id);
    }
}

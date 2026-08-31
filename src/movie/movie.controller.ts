import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { FindMovieDto } from './dto/findMovie.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('movie')
export class MovieController {
    constructor(
        private readonly movieService: MovieService
    ) { }
    @Get('start')
    async getMovies() {
        return this.movieService.extractMovie();
    }

    //@UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get movies with input description' })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post('find-movie')
    async findMovie(@Body() findMovieDto: FindMovieDto) {
        return this.movieService.findMovie(findMovieDto);
    }

    @ApiOperation({ summary: 'Get the top 10 most popular movies' })
    @Get('popular')
    async getMostPopular() {
        return this.movieService.getMostPopular();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.movieService.findOne(id);
    }

    @Get()
    async findByCategory(@Query('category') category: string) {
        return this.movieService.findByCategory(category);
    }
}

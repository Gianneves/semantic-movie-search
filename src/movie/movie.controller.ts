import { Body, Controller, Get } from '@nestjs/common';
import { MovieService } from './movie.service';
import { FindMovieDto } from './dto/findMovie.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('movie')
export class MovieController {
    constructor(
        private readonly movieService: MovieService
    ) {}
    @Get()
    async getMovies() {
        return this.movieService.extractMovie();
    }

    @ApiOperation({ summary: 'Get movies with input description' })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Get('find-movie')
    async findMovie(@Body() findMovieDto: FindMovieDto) {
        return this.movieService.findMovie(findMovieDto);
    }
}

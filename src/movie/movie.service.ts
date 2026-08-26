import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path'
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { AiService } from 'src/ai/ai.service';
import { FindMovieDto } from './dto/findMovie.dto';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
        private readonly aiService: AiService
    ) { }

    async extractMovie() {
        try {
            const filePath = path.join(process.cwd(), 'src', 'movie', 'movie_ids_07_23_2026.json');

            const fileStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity,
            });

            const movies: any[] = [];

            for await (const line of rl) {
                if (line.trim()) {
                    const movie = JSON.parse(line);

                    const details = await this.extractDescription(movie.id);

                    const cover = await this.getImages(movie.id);

                    const textTransform = JSON.stringify(details)

                    const embedding = await this.aiService.generateEmbedding(textTransform);

                    const movieData = {
                        moviedb_id: movie.id,
                        original_title: movie.original_title,
                        overview: details.overview,
                        popularity: movie.popularity,
                        release_date: details.release_date,
                        genres: details.genres,
                        cover,
                        embedding
                    }

                    await this.create(movieData);

                    movies.push(movie);
                }
            }

            console.log(`Carregados ${movies.length} filmes.`);
            return movies.length;
        } catch (error: any) {
            console.error('Erro ao ler o arquivo JSON:', error);
            throw error;
        }
    }


    async extractDescription(movieId: number) {

        const token = process.env.READ_TOKEN_API;

        const url = `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR&append_to_response=credits,keywords`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na busca do filme ${movieId}: ${response.statusText}`);
        } 

        const data = await response.json()

        const genres = data.genres.map((g) => g.name)

        const details = {
            overview: data.overview,
            genres,
            release_date: data.release_date
        }

        return details;
    }

    async getImages(movieId: number) {
        const token = process.env.READ_TOKEN_API;

        const url = `https://api.themoviedb.org/3/movie/${movieId}/images`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na busca da imagem do filme ${movieId}: ${response.statusText}`);
        }


        const data = await response.json();

        const filePath = data.file_path;
        const size = 'w500';

        const finalUrl = `https://image.tmdb.org/t/p/${size}/${filePath}`;

        return finalUrl;
    }

    async create(createMovieDto: CreateMovieDto) {
        try {

            const movie = this.movieRepository.create(createMovieDto);

            await this.movieRepository.save(movie);

            console.log(`movie ${movie.id} created`);

        } catch (error: unknown) {
            console.error(error);
        }
    }


    async findMovie(findMovieDto: FindMovieDto) {
        const movies = await this.aiService.aiGenerateResponse(findMovieDto.input);

        return movies;
    }
}

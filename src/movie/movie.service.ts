import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path'
import { ArrayContains, Repository } from 'typeorm';
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

                    const { cover, backdrops } = await this.getImages(movie.id);

                    const textTransform = JSON.stringify(details)

                    const embedding = await this.aiService.generateEmbedding(textTransform);

                    const movieData = {
                        moviedb_id: movie.id,
                        original_title: movie.original_title,
                        overview: details.overview,
                        popularity: movie.popularity,
                        release_date: details.release_date,
                        runtime: details.runtime,
                        genres: details.genres,
                        main_cast: details.mainCast,
                        director: details.director,
                        cover,
                        backdrops,
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

        const data = await response.json();

        const mainCast = (data.credits?.cast ?? [])
            .filter((actor) => actor?.name)
            .map((actor) => actor.name)
            .slice(0, 4);

        const genres = data.genres.map((g) => g.name);
        const directorEntry = data.credits?.crew?.find((person) => person.job === 'Director');
        const director = directorEntry?.name ?? null;

        const details = {
            overview: data.overview,
            genres,
            release_date: data.release_date,
            runtime: data.runtime,
            mainCast,
            director
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

        const coverPath = data.posters[0]?.file_path ?? '';
        const backdropsPath = data.backdrops[1]?.file_path ?? '';
        const size = 'w500';

        const cover = `https://image.tmdb.org/t/p/${size}/${coverPath}`;
        const backdrops = `https://image.tmdb.org/t/p/${size}/${backdropsPath}`;

        return { cover, backdrops };
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

    async getMostPopular() {
        const movies = this.movieRepository.find({
            select: {
                id: true,
                original_title: true,
                moviedb_id: true,
                cover: true,
                overview: true,
                release_date: true,
                genres: true
            },
            order: {
                popularity: 'DESC'
            },
            take: 12,
        })

        return movies;
    }

    async findOne(id: string) {
        const movie = this.movieRepository.findOne({
            select: {
                id: true,
                original_title: true,
                moviedb_id: true,
                cover: true,
                backdrops: true,
                overview: true,
                release_date: true,
                runtime: true,
                main_cast: true,
                director: true,
                genres: true
            },
            where: {
                id
            }
        });

        if (!movie) {
            throw new Error('Filme não encontrado')
        }

        return movie;
    }

    async findByCategory(category: string) {
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        const movies = await this.movieRepository.find({
            select: {
                id: true,
                original_title: true,
                moviedb_id: true,
                cover: true,
                overview: true,
                release_date: true
            },
            where: {
                genres: ArrayContains([formattedCategory])
            },
            order: {
                popularity: 'DESC'
            },
            take: 12
        });

        return movies;
    }
}

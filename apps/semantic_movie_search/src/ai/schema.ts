import z from "zod";

const MovieSchema = z.object({
    id: z.string().or(z.number()).describe('ID do filme no TheMovieDB'),
    original_title: z.string().describe('Título original do filme'),
    release_date: z.string().describe('Data de lançamento no formato YYYY-MM-DD'),
    cover: z.string().nullable().describe( 
    'A URL exata e completa contida na propriedade cover do JSON de busca'
  )
});

export const MovieListSchema = z.object({
    movies: z.array(MovieSchema).describe('Lista de filmes encontrados')
});
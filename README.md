<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h1 align="center">Semantic Movie Search</h1>

<p align="center">
  A semantic movie search engine built with <strong>NestJS</strong>, <strong>LangChain</strong>, <strong>OpenAI embeddings</strong>, and <strong>pgvector</strong>.
</p>

<p align="center">
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D%2020-brightgreen" alt="Node version" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/typescript-%5E5.7-blue" alt="TypeScript version" /></a>
  <a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/nestjs-%5E11.0-red" alt="NestJS version" /></a>
</p>

---

## About

**Semantic Movie Search** is an API that allows you to search for movies using natural language — not just keywords. Instead of matching exact terms, it understands the **meaning** behind your query using vector embeddings and AI.

For example, searching for *"a movie about a dinosaur theme park that goes wrong"* will correctly return **Jurassic Park**, even though the word "dinosaur" never needs to appear as a literal match.

This project was built as a portfolio piece to demonstrate **RAG (Retrieval-Augmented Generation)**, **vector search**, and **LLM integration** in a practical backend application.

## How It Works

```
User query
     │
     ▼
 ┌──────────────────────┐
 │   OpenAI Embedding   │  text-embedding-3-small (1536 dimensions)
 │   (user input → vec) │
 └──────────┬───────────┘
            ▼
 ┌──────────────────────┐
 │  pgvector similarity │  Cosine distance search on stored movie embeddings
 │  search (nearest K)  │
 └──────────┬───────────┘
            ▼
 ┌──────────────────────┐
 │  LLM response gen    │  gpt-4o-mini formats results in natural language
 │  (RAG prompt)        │  (Portuguese / pt-BR)
 └──────────┬───────────┘
            ▼
   Formatted movie list
```

### Flow:
1. User sends a natural language query via `GET /api/v1/movie/find-movie`
2. The query is converted into a vector embedding using OpenAI's `text-embedding-3-small`
3. A similarity search is performed against the `movies` table using **pgvector** (cosine distance via `<=>` operator)
4. The top 5 most semantically similar movies are retrieved
5. An LLM (`gpt-4o-mini`) generates a human-readable response in **Brazilian Portuguese**, listing titles, genres, release dates, and summaries

## Technologies Used

| Category | Technology |
|----------|-----------|
| **Framework** | NestJS 11 |
| **Language** | TypeScript |
| **Database** | PostgreSQL + [pgvector](https://github.com/pgvector/pgvector) |
| **ORM** | TypeORM |
| **AI / LLM** | LangChain, OpenAI (`text-embedding-3-small`, `gpt-4o-mini`) |
| **Data Source** | [The Movie Database (TMDB)](https://www.themoviedb.org/) |
| **API Docs** | Swagger (`@nestjs/swagger`) |
| **Rate Limiting** | `@nestjs/throttler` |
| **Containerization** | Docker / docker-compose |

## Prerequisites

- **Node.js** >= 20
- **Docker** and **Docker Compose**
- An **OpenAI API key** with access to embedding and chat models
- A **TMDB API read access token** (free, [sign up here](https://www.themoviedb.org/signup))

## Setup

### 1. Clone the repository

```bash
git clone git@github.com:Gianneves/semantic-movie-search.git
cd semantic-movie-search
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:
- `OPENAI_API_KEY` — your OpenAI API key
- `READ_TOKEN_API` — your TMDB API Read Access Token
- `THEMOVIEDB_API_KEY` — your TMDB API Key (v3 auth)

### 3. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL with the pgvector extension pre-installed.

### 4. Install dependencies

```bash
npm install
```

### 5. Run the application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`.

Swagger documentation is available at `http://localhost:3000/api-doc` (only in dev mode).

### 6. Download the movie IDs dataset

Download the TMDB movie IDs file and place it at `src/movie/movie_ids_07_23_2026.json`:

```bash
# Example using TMDB's daily export (check the latest file at https://files.tmdb.org/p/exports/)
curl -o src/movie/movie_ids_07_23_2026.json.gz "https://files.tmdb.org/p/exports/movie_ids_07_23_2026.json.gz"
gzip -d src/movie/movie_ids_07_23_2026.json.gz
```

> This file is excluded from version control due to its size (~120 MB). The date in the filename should match the current date.

### 7. Import movie data

The first step after starting is to populate the database with movie data:

```
GET /api/v1/movie
```

This reads the `movie_ids_07_23_2026.json` file, fetches details from TMDB for each movie, generates embeddings, and stores everything in PostgreSQL.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/movie` | Bulk import movies from JSON + TMDB (generates embeddings) |
| `GET` | `/api/v1/movie/find-movie` | Semantic movie search (body: `{ "input": "your query" }`) |

### Example request

```bash
curl -X GET "http://localhost:3000/api/v1/movie/find-movie" \
  -H "Content-Type: application/json" \
  -d '{ "input": "um filme sobre um parque de dinossauros que dá errado" }'
```

## Project Structure

```
src/
├── main.ts                  # Entry point + Swagger setup
├── app.module.ts            # Root module
├── ai/
│   ├── ai.module.ts         # AI module
│   └── ai.service.ts        # Embedding generation + LLM agent
└── movie/
    ├── movie.module.ts      # Movie module
    ├── movie.controller.ts  # REST endpoints
    ├── movie.service.ts     # Business logic + TMDB integration
    ├── dto/                 # Request validation DTOs
    └── entities/            # TypeORM entity (pgvector column)
```

## Notes

- This is a **portfolio project** and is not intended for production use.
- No authentication is implemented — all endpoints are public.
- LLM responses are generated in **Brazilian Portuguese (pt-BR)**.
- The `.env` file is excluded from version control (see `.gitignore`). Use `.env.example` as a template.

# BookFilm Finder

Full-stack web app to find the books behind movies and vice versa.

## Tech stack

- **Backend** — Java 21 + Spring Boot 3 + PostgreSQL
- **API Gateway** — Node.js + Express
- **Frontend** — React + Vite

## Architecture
## Features

- Search books and movies by title
- Find which movie a book was adapted into
- Find which book a movie is based on
- REST API with full CRUD for books, movies and adaptations

## Getting started

### Requirements
- Java 21
- Node.js 20
- PostgreSQL 16

### Database setup
```sql
CREATE DATABASE bookfilm;
CREATE USER bookfilm_user WITH PASSWORD 'bookfilm123';
GRANT ALL PRIVILEGES ON DATABASE bookfilm TO bookfilm_user;
```

### Run the backend
```bash
cd backend
./mvnw spring-boot:run
```

### Run the API gateway
```bash
cd api-gateway
node index.js
```

### Run the frontend
```bash
cd frontend
npm run dev
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/libros | List all books |
| GET | /api/libros/search?titulo= | Search books |
| POST | /api/libros | Create book |
| GET | /api/peliculas | List all movies |
| GET | /api/peliculas/search?titulo= | Search movies |
| POST | /api/peliculas | Create movie |
| POST | /api/adaptaciones | Link book to movie |
| GET | /api/adaptaciones/libro/:id | Movies based on a book |
| GET | /api/adaptaciones/pelicula/:id | Book a movie is based on |

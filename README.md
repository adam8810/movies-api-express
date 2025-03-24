# Movie API

## Running

`npm run start`

## Testing

`npm run test`

With watch mode on:
`npm run test -- --watch`

## Endpoints

| Endpoint               | Method | Description                                                           |
| ---------------------- | ------ | --------------------------------------------------------------------- |
| `/movies`              | GET    | Get all movies with optional pagination                               |
| `/movies/:id`          | GET    | Get a specific movie by ID                                            |
| `/movies/year/:year`   | GET    | Get all movies released in a specific year with optional pagination   |
| `/movies/genre/:genre` | GET    | Get all movies belonging to a specific genre with optional pagination |

## Environment Variables

| Variable        | Description                                          | Default      |
| --------------- | ---------------------------------------------------- | ------------ |
| PORT            | The port number the server will listen on            | 8089         |
| MOVIE_LIMIT     | The maximum number of movies to return in a response | 50           |
| MOVIE_DB_PATH   | Path to the movie database file                      | ./movies.db  |
| RATINGS_DB_PATH | Path to the ratings database file                    | ./ratings.db |

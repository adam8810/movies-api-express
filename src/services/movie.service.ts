import Database from "../db/sqliteDatabase";
import logger from "../utils/logger";
import { Movie, MovieWithRating } from "../types/Movie";

const MOVIE_LIMIT = process.env.MOVIE_LIMIT
  ? parseInt(process.env.MOVIE_LIMIT)
  : 50;

export class MovieService {
  private db: Database;

  constructor(providedDb?: Database) {
    if (providedDb) {
      this.db = providedDb;
    } else {
      this.db = new Database(process.env.MOVIE_DB_PATH || "./movies.db");

      const dbPath = process.env.RATINGS_DB_PATH || "./ratings.db";

      // Make the ratings database available for joining
      this.db.query(`ATTACH DATABASE '${dbPath}' AS ratings;`);
    }
  }

  transformMovieData(movie: Movie | MovieWithRating): MovieWithRating {
    const genres =
      movie?.genres === "" ? [] : JSON.parse(movie?.genres ?? "[]");
    const productionCompanies =
      movie?.productionCompanies === ""
        ? []
        : JSON.parse(movie?.productionCompanies ?? "[]");

    return {
      ...movie,
      ...(movie?.genres && { genres: genres }),
      ...(movie?.productionCompanies && {
        productionCompanies: productionCompanies,
      }),
      ...(movie?.budget && { budget: `$${movie.budget}` }),
      ...("avgRating" in movie &&
        movie.avgRating && {
          avgRating: parseFloat(movie.avgRating.toFixed(2)) ?? 0,
        }),
    };
  }

  async getAllMovies(
    page: number = 1,
    limit: number = MOVIE_LIMIT
  ): Promise<Movie[]> {
    try {
      const query = `
      SELECT m.movieId, imdbId, title, genres, releaseDate, budget
      FROM movies m
      LIMIT ?
      OFFSET ?;
      `;

      const movies = await this.db.query<Movie>(query, [
        limit,
        (page - 1) * limit,
      ]);

      return movies.map(this.transformMovieData);
    } catch (error) {
      logger.error("Error fetching movies:", error);
      throw new Error("Failed to fetch movies");
    }
  }

  async getMovieById(id: number): Promise<MovieWithRating | null> {
    try {
      const query = `
      SELECT imdbId, title, overview, releaseDate, budget, runtime,
      language, productionCompanies,
      AVG(ratings.rating) as avgRating, COUNT(ratings.rating) as ratingCount
      FROM movies m
      INNER JOIN ratings on ratings.movieId = m.movieId
      WHERE m.movieId = ?
      HAVING COUNT(ratings.rating) > 0;
    `;

      const movie = (await this.db.get<MovieWithRating>(query, [id])) ?? null;

      return movie ? this.transformMovieData(movie) : null;
    } catch (error) {
      logger.error("Error fetching movie by ID:", error);
      throw new Error("Failed to fetch movie by ID");
    }
  }

  async getMoviesByYear(
    year: number,
    sort: string = "asc",
    page: number = 1,
    limit: number = MOVIE_LIMIT
  ): Promise<Movie[]> {
    try {
      const safeSortOrder = sort.toLowerCase() === "desc" ? "DESC" : "ASC";

      const query = `
        SELECT imdbId, title, genres, releaseDate, budget
        FROM movies m
        WHERE releaseDate LIKE ?
        ORDER BY releaseDate ${safeSortOrder}
        LIMIT ?
        OFFSET ?;
      `;

      const movies = await this.db.query<Movie>(query, [
        `${year}%`,
        limit,
        (page - 1) * limit,
      ]);

      return movies.map(this.transformMovieData);
    } catch (error) {
      logger.error("Error fetching movies by year:", error);
      throw new Error("Failed to fetch movies by year");
    }
  }

  async getMoviesByGenre(
    genre: string,
    page: number = 1,
    limit: number = MOVIE_LIMIT
  ): Promise<Movie[]> {
    try {
      const query = `
      SELECT m.movieId, imdbId, title, genres, releaseDate, budget
      FROM movies m
      WHERE LOWER(genres) LIKE ?
      LIMIT ?
      OFFSET ?;
    `;
      const movies = await this.db.query<Movie>(query, [
        `%${genre.toLowerCase()}%`,
        limit,
        (page - 1) * limit,
      ]);

      return movies.map(this.transformMovieData);
    } catch (error) {
      logger.error("Error fetching movies by genre:", error);
      throw new Error("Failed to fetch movies by genre");
    }
  }
}

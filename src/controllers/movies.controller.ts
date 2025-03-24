import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  buildSuccessfulApiResponse,
  buildErrorApiResponse,
} from "../types/ApiResponse";
import { MovieService } from "../services/movie.service";

const MOVIE_LIMIT = process.env.MOVIE_LIMIT
  ? parseInt(process.env.MOVIE_LIMIT)
  : 50;

export class MovieController {
  private movieService: MovieService;

  constructor() {
    this.movieService = new MovieService();
  }

  getAllMovies = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || MOVIE_LIMIT;

    res.json(
      buildSuccessfulApiResponse(
        await this.movieService.getAllMovies(page, limit)
      )
    );
  };

  getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
      const movieId = parseInt(req.params.id);
      if (isNaN(movieId)) {
        res.status(400).json(buildErrorApiResponse("Invalid movie ID"));
        return;
      }

      const movie = await this.movieService.getMovieById(movieId);
      if (!movie) {
        res.status(404).json(buildSuccessfulApiResponse(movie));
        return;
      }

      res.json(buildSuccessfulApiResponse(movie));
    } catch (error) {
      logger.error("Error in getMovieById:", error);
      res.status(500).json(buildErrorApiResponse("Failed to fetch movie"));
    }
  };

  getMovieByYear = async (req: Request, res: Response): Promise<void> => {
    try {
      const year = parseInt(req.params.year);
      const sort = req.query.sort as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || MOVIE_LIMIT;

      if (sort && !["asc", "desc"].includes(sort.toLowerCase())) {
        res.status(400).json(buildErrorApiResponse("Invalid sort parameter"));
        return;
      }

      if (isNaN(year)) {
        res.status(400).json(buildErrorApiResponse("Invalid year"));
        return;
      }

      const movies = await this.movieService.getMoviesByYear(
        year,
        sort,
        page,
        limit
      );

      if (!movies) {
        res.status(404).json(buildSuccessfulApiResponse(movies));
        return;
      }

      res.json(buildSuccessfulApiResponse(movies));
    } catch (error) {
      logger.error("Error in getMovieByYear:", error);
      res
        .status(500)
        .json(buildErrorApiResponse("Failed to fetch movies by year"));
    }
  };

  getMovieByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
      const genre = req.params.genre;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || MOVIE_LIMIT;

      if (!genre) {
        res.status(400).json(buildErrorApiResponse("Invalid genre"));
        return;
      }

      const movies = await this.movieService.getMoviesByGenre(
        genre,
        page,
        limit
      );

      if (!movies) {
        res.status(404).json(buildSuccessfulApiResponse([]));
        return;
      }

      res.json(buildSuccessfulApiResponse(movies));
    } catch (error) {
      logger.error("Error in getMovieByGenre:", error);
      res
        .status(500)
        .json(buildErrorApiResponse("Failed to fetch movies by genre"));
    }
  };
}

export default new MovieController();

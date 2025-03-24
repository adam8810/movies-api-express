import { MovieService } from "./movie.service";
import { Movie, MovieWithRating } from "../types/Movie";

describe("MovieService", () => {
  let movieService: MovieService;

  beforeEach(() => {
    const mockDb = {
      query: jest.fn(),
      get: jest.fn(),
    };

    // Pass a mocked database to the MovieService to avoid actual database calls
    movieService = new MovieService(mockDb as any);
  });

  describe("transformMovieData", () => {
    it("transforms and jsonify's correctly", () => {
      // Arrange
      const movie: Movie = {
        movieId: 1,
        imdbId: "tt1",
        title: "Title",
        genres: '[{"id": 1, "name": "Genre1"}, {"id": 2, "name": "Genre2"}]',
        releaseDate: "2024-10-12",
        budget: "12345",
        overview: "",
        productionCompanies:
          '[{"id": 1, "name": "Production1"}, {"id": 2, "name": "Production2"}]',
        revenue: 0,
        runtime: 0,
        language: null,
        status: "released",
      };

      // Act
      const transformedMovie = movieService.transformMovieData(movie);

      // Assert
      // Make sure genres is returned as a json array
      expect(transformedMovie.genres).toStrictEqual([
        { id: 1, name: "Genre1" },
        { id: 2, name: "Genre2" },
      ]);

      // Make sure productionCompanies is returned as a json array
      expect(transformedMovie.productionCompanies).toStrictEqual([
        { id: 1, name: "Production1" },
        { id: 2, name: "Production2" },
      ]);
      expect(transformedMovie.budget).toBe("$12345");
      expect(transformedMovie.movieId).toBe(1);
      expect(transformedMovie.title).toBe("Title");
    });

    it("transforms a movie with rating correctly", () => {
      // Arrange
      const movieWithRating: MovieWithRating = {
        movieId: 1,
        imdbId: "tt1",
        title: "Title",
        genres: '[{"id": 1, "name": "Genre1"}, {"id": 2, "name": "Genre2"}]',
        releaseDate: "2024-10-12",
        budget: "12345",
        overview: "Overview",
        runtime: 175,
        avgRating: 9.198765,
        ratingCount: 8327,
        productionCompanies:
          '[{"id": 1, "name": "Production1"}, {"id": 2, "name": "Production2"}]',
        revenue: 0,
        language: null,
        status: "released",
      };

      // Act
      const transformedMovie = movieService.transformMovieData(movieWithRating);

      // Assert
      expect(transformedMovie.genres).toStrictEqual([
        { id: 1, name: "Genre1" },
        { id: 2, name: "Genre2" },
      ]);
      expect(transformedMovie.budget).toBe("$12345");
      expect(transformedMovie.avgRating).toBe(9.2);
      expect(transformedMovie.ratingCount).toBe(8327);
    });

    it("handles missing budget field", () => {
      // Arrange
      const movie: Movie = {
        movieId: 1,
        imdbId: "tt1",
        title: "Title",
        genres: '[{"id": 1, "name": "Genre1"}, {"id": 2, "name": "Genre2"}]',
        releaseDate: "2024-10-12",
        overview: "",
        productionCompanies:
          '[{"id": 1, "name": "Production1"}, {"id": 2, "name": "Production2"}]',
        budget: "",
        revenue: 0,
        runtime: 0,
        language: null,
        status: "released",
      };

      // Act
      const transformedMovie = movieService.transformMovieData(movie);

      // Assert
      expect(transformedMovie.genres).toStrictEqual([
        { id: 1, name: "Genre1" },
        { id: 2, name: "Genre2" },
      ]);
      expect(transformedMovie.budget).toBe("");
    });

    it("allows for an empty genre", () => {
      // Arrange
      const movie: Movie = {
        movieId: 1,
        imdbId: "tt1",
        title: "Title",
        genres: "",
        releaseDate: "2024-10-12",
        budget: "12345",
        overview: "",
        productionCompanies:
          '[{"id": 1, "name": "Production1"}, {"id": 2, "name": "Production2"}]',
        revenue: 0,
        runtime: 0,
        language: null,
        status: "released",
      };

      // Act
      const transformedMovie = movieService.transformMovieData(movie);

      // Assert
      expect(transformedMovie.genres).toEqual("");
      expect(transformedMovie.budget).toBe("$12345");
    });

    it("handles null genres", () => {
      // Arragne
      const movie: Movie = {
        movieId: 1,
        imdbId: "tt1",
        title: "Overview",
        genres: null,
        releaseDate: "1966-12-23",
        budget: "12345",
        overview: "",
        productionCompanies:
          '[{"id": 1, "name": "Production1"}, {"id": 2, "name": "Production2"}]',
        revenue: 0,
        runtime: 0,
        language: null,
        status: "released",
      };

      // Act
      const transformedMovie = movieService.transformMovieData(movie);

      // Assert
      expect(transformedMovie.genres).toEqual(null);
      expect(transformedMovie.budget).toBe("$12345");
    });

    it("handles movie with zero rating (no $)", () => {
      // Arrange
      const movieWithRating: MovieWithRating = {
        movieId: 1,
        imdbId: "tt1",
        title: "Title",
        genres: '[{"id": 1, "name": "Genre1"}, {"id": 2, "name": "Genre2"}]',
        releaseDate: "2024-10-12",
        budget: "12345",
        overview: "Overview",
        runtime: 152,
        avgRating: 0,
        ratingCount: 0,
        productionCompanies:
          '[{"id": 1, "name": "Production1"}, {"id": 2, "name": "Production2"}]',
        revenue: 0,
        language: null,
        status: "released",
      };

      // Act
      const transformedMovie = movieService.transformMovieData(movieWithRating);

      // Assert
      expect(transformedMovie.genres).toStrictEqual([
        { id: 1, name: "Genre1" },
        { id: 2, name: "Genre2" },
      ]);
      expect(transformedMovie.budget).toBe("$12345");
      expect(transformedMovie.avgRating).toBe(0);
    });

    it("jsonifies productionCompanies", () => {
      // Arrange
      const movieWithRating: MovieWithRating = {
        movieId: 1,
        imdbId: "tt1",
        title: "Title",
        genres: '[{"id": 1, "name": "Genre1"}, {"id": 2, "name": "Genre2"}]',
        releaseDate: "2024-10-12",
        budget: "12345",
        overview: "Overview",
        runtime: 152,
        avgRating: 0,
        ratingCount: 0,
        productionCompanies:
          '[{"id": 1, "name": "Production1"}, {"id": 2, "name": "Production2"}]',
        revenue: 0,
        language: null,
        status: "released",
      };

      // Act
      const transformedMovie = movieService.transformMovieData(movieWithRating);

      // Assert
      expect(transformedMovie.productionCompanies).toStrictEqual([
        { id: 1, name: "Production1" },
        { id: 2, name: "Production2" },
      ]);
    });
  });
});

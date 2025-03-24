export interface Movie {
  movieId: number;
  imdbId: string;
  title: string;
  overview: string;
  productionCompanies: string;
  releaseDate: string;
  budget: string;
  revenue: number;
  runtime: number;
  language: string | null;
  genres: string | null;
  status: string;
}

export interface MovieWithRating extends Movie {
  avgRating?: number;
  ratingCount?: number;
}

import { Router } from "express";
import MovieController from "../controllers/movies.controller";

const router = Router();

router.get("/", MovieController.getAllMovies);
router.get("/:id", MovieController.getMovieById);

// Note: Not very RESTful but I interpreted the requirements as separate endpoints
router.get("/year/:year", MovieController.getMovieByYear);
router.get("/genre/:genre", MovieController.getMovieByGenre);

export default router;

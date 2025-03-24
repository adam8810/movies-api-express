import { Router } from "express";
import MovieRoute from "./movies.route";

const router = Router();

router.use("/movies", MovieRoute);
// Note: As part of the considerations new RESTful resources can be added here

export default router;

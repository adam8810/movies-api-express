import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { buildErrorApiResponse } from "../types/ApiResponse";

export default function errorHandlers(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.stack);
  res.status(500).json(buildErrorApiResponse(err.message));
}

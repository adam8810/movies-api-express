import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import notFoundHandler from "./middleware/notFoundHandler";
import logger from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Routes
app.use("/api/v1", routes);

// Simple health check which would be useful for load balancers in production
app.get("/api/health", (_, res) => {
  res.status(200).json({
    status: "UP",
  });
});

// Handle routes that don't exist
app.use(notFoundHandler);

// Catch all unhandled errors
app.use(errorHandler);

const PORT = process.env.PORT || 8089;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

const shutdown = (): void => {
  logger.info("Shutting down server...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
};

// Shut down gracefully if necessary
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

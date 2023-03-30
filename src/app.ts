import express from "express";
import morgen from "morgan";
import { errorHandler } from "./middleware";
import apiRouter from "./apis/routes";

// create express application instance
const app = express();

// setup middlewares
app.use(express.json());
app.use(morgen("dev"));

// setup routes
app.use("/api/v1", apiRouter);

// 404 error register
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ message: `${req.method.toUpperCase()} method Not Found!!` });
});

// add error middleware
app.use(errorHandler);

// export express application instance
export default app;

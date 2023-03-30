import httpErrors from "http-errors";
import { Request, Response, NextFunction } from "express";

// main error handler middleware
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  _: NextFunction
) {
  if (httpErrors.isHttpError(error)) {
    const { status } = error;
    return res.status(status).json({
      success: false,
      data: { ...error },
    });
  }
  console.log(error);
  return res.status(500).json({
    success: false,
    data: {
      message: "Internal Server Error",
      error: error.message,
    },
  });
}

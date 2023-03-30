import { Request, Response, NextFunction } from "express";

// response customize using interceptor
export default function resJsonInterceptor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Save the original res.json method
  const originalJson = res.json;

  // Create a new implementation of res.json
  res.json = function (body?: any) {
    // Add the status and message fields to the response body
    const response = {
      status: res.statusCode,
      message: res.statusMessage,
      ...body,
    };

    // Call the original res.json method with the modified arguments
    return originalJson.call(res, response);
  };

  // Call next() to pass control to the next middleware function or request handler
  next();
}

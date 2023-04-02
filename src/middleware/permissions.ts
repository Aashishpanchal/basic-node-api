import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export function isReadOnly(req: Request, res: Response, next: NextFunction) {
  try {
    if (!SAFE_METHODS.includes(req.method.toUpperCase()))
      throw createHttpError.Forbidden(
        `you have no access "${req.method}" method`
      );
  } catch (error) {
    next(error);
  } finally {
    next();
  }
}

export function isAdminUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(req.user?.is_active && req.user.is_staff && req.user.is_superuser))
      throw createHttpError.Forbidden(
        `you have no access "${req.method}" method`
      );
  } catch (error) {
    next(error);
  } finally {
    next();
  }
}

import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import Messages from "./message";
import { userService } from "../users";
import { AccessToken } from "./service";
import { JWT } from "../../configs/settings";

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authStr = req.headers[JWT.auth_header_name] as string;

    if (!authStr)
      throw createHttpError.Unauthorized(Messages.AUTH_HEADER_NOT_FOUND);

    const [str, tokenStr] = authStr.split(" ");

    if (!JWT.auth_header_type.includes(str.toLowerCase()))
      throw createHttpError.Unauthorized(
        `auth header type invalid, token should be start from "${JWT.auth_header_type}"`
      );

    const token = await AccessToken.verifyToken(tokenStr);

    const user = await userService.findOne(token.get("user_id") || "");

    if (!user.is_active) throw createHttpError.Forbidden(Messages.NOT_ACCESS);

    req.user = user as any;
  } catch (error) {
    return next(error);
  } finally {
    return next();
  }
}

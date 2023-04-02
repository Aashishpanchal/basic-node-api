import httpStatus from "http-status";
import { userService } from "../users";
import { RefreshToken } from "./service";
import { Request, Response } from "express";
import { isAuthenticated } from "./middleware";
import { Controller, HTTPMethod } from "../../core/controller";
import { credentialsV, tokenV } from "./validations";

export class CreDelTokenController extends Controller {
  // override set middlewares method
  setMiddlewares(method: HTTPMethod) {
    if (method === "delete") return [isAuthenticated];
    return super.setMiddlewares(method);
  }

  // override get-suffix method
  getSuffix(method: HTTPMethod) {
    if (method === "delete") return "";
    return super.getSuffix(method);
  }

  // this method handle token create
  async post(req: Request, res: Response) {
    // applied validation
    const {
      body: { username, password },
    } = await credentialsV.isValid<any>(req);
    // create user data in database
    const user = await userService.login(username, password);

    const token = RefreshToken.forUser(user);

    // return res of post http method
    return res.status(httpStatus.OK).json({
      success: true,
      data: {
        refresh: String(token),
        access: String(token.accessToken),
      },
    });
  }

  // this method handle token delete in redis database
  async delete(req: Request, res: Response) {
    // check token available in body or not
    const {
      body: { token },
    } = await tokenV.isValid<any>(req);

    // verify token
    const refToken = await RefreshToken.verifyToken(token);

    const data = await refToken.blackList();

    // new and fresh token
    res.status(httpStatus.NO_CONTENT).json({
      success: true,
      data,
    });
  }
}

export class RefreshTokenController extends Controller {
  // this method handle refresh of token
  async post(req: Request, res: Response) {
    // check token available in body or not
    const {
      body: { token },
    } = await tokenV.isValid<any>(req);

    // verify token
    const refToken = await RefreshToken.verifyToken(token);

    // reset some property of payload
    refToken.resetToken();
    refToken.accessToken.resetToken();

    // new and fresh token
    res.status(httpStatus.OK).json({
      success: true,
      data: {
        refresh: String(refToken),
        access: String(refToken.accessToken),
      },
    });
  }
}

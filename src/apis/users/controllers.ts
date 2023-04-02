import httpStatus from "http-status";
import userService from "./service";
import { Request, Response } from "express";
import { userCV, userIdParam, userListQuery, userUV } from "./validations";
import { Controller, HTTPMethod } from "../../core/controller";
import { isAuthenticated } from "../token/middleware";

export const urlSuffix = "user_id";

/*
  this class handle user create and update
*/
export class UserCURController extends Controller {
  urlSuffix: string = urlSuffix;

  setMiddlewares(methods: HTTPMethod) {
    if (methods === "patch")
      return [isAuthenticated]; // only authenticated user allow
    else if (methods === "get") return [isAuthenticated]; // only authenticated user allow
    return super.setMiddlewares(methods);
  }

  async get(req: Request, res: Response) {
    return res.status(httpStatus.OK).json({ success: true, data: req.user });
  }

  // this method handle user create
  async post(req: Request, res: Response) {
    // applied validation
    const { body } = await userCV.isValid<any>(req);
    // create user data in database
    const data = await userService.create(body);
    // return res of post http method
    return res.status(httpStatus.OK).json({ success: true, data });
  }

  // this method handle user update
  async patch(req: Request, res: Response) {
    // applied validation
    const { params, body } = await userUV.isValid<any, any>(req);
    // update user data in database
    const data = await userService.update(params[this.urlSuffix], body);
    // return res of put http method
    res.status(httpStatus.OK).json({ success: true, data });
  }
}

/*
  this class handle get user request
*/
export class UserRetrieveController extends Controller {
  middlewares = [isAuthenticated]; // access only authenticated user allow

  async get(req: Request, res: Response) {
    // applied validation
    const { params } = await userIdParam.isValid<any, any>(req);
    // get user data from database
    const data = await userService.findOne(params[urlSuffix]);
    // return res of get http method
    res.status(httpStatus.OK).json({ success: true, data });
  }
}

/**
 * this class handle pagination and get list of user
 */
export class UserListController extends Controller {
  middlewares = [isAuthenticated]; // access only authenticated user allow

  // get all user using pagination
  async get(req: Request, res: Response) {
    const { query } = await userListQuery.isValid<any, any, any>(req);
    // get All user data from database
    const data = await userService.findAll(query.sort as string[]);
    // return res of get http method
    res.status(httpStatus.OK).json({ success: true, data });
  }
}

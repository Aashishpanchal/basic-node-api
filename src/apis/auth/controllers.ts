import { Request, Response } from "express";
import { Controller, HTTPMethod } from "../../core/controller";

export default class AuthController extends Controller {
  get(req: Request, res: Response) {
    res.json({
      name: "Auth Aashish Panchal",
    });
  }
}

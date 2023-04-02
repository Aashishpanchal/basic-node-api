import { Express } from "express-serve-static-core";
import { HydratedDocument } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
}

declare module "express-serve-static-core" {
  interface Request {
    user: HydratedDocument<IUser> | null;
  }
}

import Joi from "joi";
import { joiValidate } from "../../core/validation";

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/, "object Id");

// user create validate
export class userCV extends joiValidate {
  protected body = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(16).required(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
  });
}

export class userIdParam extends joiValidate {
  protected params = Joi.object({
    user_id: ObjectId.required(),
  });
}

// user update validate
export class userUV extends userIdParam {
  protected body = Joi.object({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
  });
}

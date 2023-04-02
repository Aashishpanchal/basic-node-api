import Joi from "joi";
import Messages from "./message";
import { joiValidate } from "../../core/validation";

export class credentialsV extends joiValidate {
  protected body = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
}

export class tokenV extends joiValidate {
  protected body = Joi.object({
    token: Joi.string()
      .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
      .required()
      .messages({
        "string.pattern.base": Messages.INVALID_JWT,
      }),
  });
}

import { Request } from "express";
import Joi, { Schema } from "joi";
import httpError from "http-errors";
import httpStatus from "http-status";

interface IReturnObj<body, params, query> {
  body?: body;
  params?: params;
  query?: query;
}

// validation class to handle validation, body, params, query
export class joiValidate {
  protected declare params: Schema;
  protected declare body: Schema;
  protected declare query: Schema;

  protected async validate(schema: Schema, value: any) {
    try {
      return await schema.validateAsync(value, { abortEarly: false });
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        throw httpError(httpStatus.BAD_REQUEST, {
          errors: error.details,
        });
      }
    }
  }

  validateBody(value: any) {
    return this.validate(this.body, value);
  }

  validateQuery(value: any) {
    return this.validate(this.query, value);
  }

  validateParams(value: any) {
    return this.validate(this.params, value);
  }

  static async isValid<body = {}, params = {}, query = {}>(req: Request) {
    const instance = new this();
    const returnObj: IReturnObj<body, params, query> = {};
    if (Joi.isSchema(instance.body)) {
      returnObj["body"] = await instance.validateBody(req.body);
    }
    if (Joi.isSchema(instance.params)) {
      returnObj["params"] = await instance.validateParams(req.params);
    }
    if (Joi.isSchema(instance.query)) {
      returnObj["query"] = await instance.validateQuery(req.query);
    }
    return returnObj;
  }
}

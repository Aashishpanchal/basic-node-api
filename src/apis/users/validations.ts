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

export class userListQuery extends joiValidate {
  default_selected_fields = [
    "id",
    "username",
    "email",
    "first_name",
    "last_name",
    "is_staff",
    "is_active",
    "is_superuser",
  ];

  max_page_size = 10;

  protected query = Joi.object({
    sort: Joi.string().default(""),
    page: Joi.number().integer().positive().max(this.max_page_size),
    size: Joi.number().integer().positive(),
    fields: Joi.string()
      .default(this.default_selected_fields)
      // custom function
      .custom((value, helper) => {
        try {
          // make array fields
          const array = (value as string).split(",").map((item) => item.trim());
          // check fields
          for (const iterator of array) {
            if (!this.default_selected_fields.includes(iterator))
              // fields match throw error
              return helper.message({
                custom: `you can only take these fields ${this.default_selected_fields}`,
              });
          }
          return array;
        } catch (error) {
          return helper.message({
            custom: `Failed to convert ${value} to array`,
          });
        }
      }),
  });
}

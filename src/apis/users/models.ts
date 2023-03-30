import { hash, compare } from "bcrypt";
import mongoose, { Model, Schema, HydratedDocument } from "mongoose";
import { ENCRYPT_SALT } from "../../configs/settings";

// User Interface
export interface IUser {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

// UserMethods Interface
export interface IUserMethods {
  isValidPassword(password: string): Promise<boolean>;
}

// type of UserModel
type UserModel = Model<IUser, {}, IUserMethods>;
// type of UserDocument
type UserDocument = HydratedDocument<IUser>;

// make schema of user
const usersSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// add middleware of mongoose
usersSchema.pre<IUser>("save", async function (next) {
  const hashedPassword = await hash(this.password, ENCRYPT_SALT);
  this.password = hashedPassword;
  next();
});

// add definitions of some user-model methods
usersSchema.method(
  "isValidPassword",
  async function (this: UserDocument, password) {
    return await compare(password, this.password);
  }
);
// some other changes
usersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// set global toJSON method
usersSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret, options) {
    const full_name =
      ret.first_name && ret.last_name
        ? ret.first_name + " " + ret.last_name
        : ""; // make full_name using first_name and last_name

    delete ret._id;
    ret.id = ret.id;
    // return specific data
    return {
      id: ret.id,
      username: ret.username,
      email: ret.email,
      first_name: ret.first_name,
      last_name: ret.last_name,
      full_name,
    };
  },
});

// make UserModel using user-schema
export const Users = mongoose.model("User", usersSchema);

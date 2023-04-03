import { hash, compare } from "bcrypt";
import mongoose, { Model, Schema, HydratedDocument } from "mongoose";
import { ENCRYPT_SALT } from "../../configs/settings";
import { IUser } from "../../../types";

// User-Methods Interface
export interface IUserMethods {
  isValidPassword(password: string): Promise<boolean>;
}

// type of User-Document
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

// type of User-Model
interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByUsernameAndPassword(
    email: string,
    password: string
  ): Promise<UserDocument>;
}

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
    is_active: {
      type: Boolean,
      default: true,
    },
    is_staff: {
      type: Boolean,
      default: false,
    },
    is_superuser: {
      type: Boolean,
      default: false,
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

// add static methods
usersSchema.static(
  "findByUsernameAndPassword",
  async function (username, password) {
    const user = await this.findOne<UserDocument>({ username }, "+password");

    if (!user) return;

    const isPwdMatched = await user.isValidPassword(password);

    if (!isPwdMatched) return;

    return user;
  }
);

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
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
    delete ret.password;
    ret.id = ret.id;
    ret.full_name = full_name;
  },
});

// make UserModel using user-schema
export const Users = mongoose.model<IUser, UserModel>("User", usersSchema);

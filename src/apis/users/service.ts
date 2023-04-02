import Messages from "./message";
import httpError from "http-errors";
import httpStatus from "http-status";
import { IUser } from "../../../types";
import { UserDocument, Users } from "./models";

// user service class to help user and other controllers
class UserService {
  // create method to help create document in mongodb database
  async create(data: IUser) {
    try {
      // check username and email already exist or not
      let user = await Users.findOne({
        username: data.username,
        email: data.email,
      });

      if (user)
        throw httpError(
          httpStatus.BAD_REQUEST,
          `"${data.username}" ${Messages.USER_ALREADY_EXIST}`
        );

      // after check create user document using create method
      const createdUser = await Users.create(data);
      // to return json data
      return createdUser;
    } catch (error: any) {
      // throw server internal error
      throw error;
    }
  }
  // update method to help update document in mongodb database
  async update(id: string, data: IUser) {
    // check and user id exit or update user
    // new is true give object after update, and new is false give object before update
    const updatedUser = await Users.findByIdAndUpdate(id, data, { new: true });

    // user update or not
    if (!updatedUser)
      throw httpError(httpStatus.BAD_REQUEST, Messages.USER_NOT_EXIST);

    // return update user json
    return updatedUser;
  }
  // findOne method to help get user document from mongodb database
  async findOne(id: string) {
    // find user data and get using findById, is required id argument
    const user = await Users.findById(id);

    // get or not after throw error
    if (!user) {
      throw new httpError.BadRequest(Messages.USER_NOTFOUND);
    }
    // return user json
    return user;
  }

  // findAll method to help get all user data document from mongodb database
  async findAll(sort: string[]) {
    const users = await Users.find()
      .select([
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
        "is_superuser",
      ])
      .sort(sort.reduce((p, c) => ({ ...p, [c]: 1 }), {}));

    return users;
  }

  // login method to help check user credentials is valid or not
  async login(username: string, password: string): Promise<UserDocument> {
    // check username is exist or not
    const user = await Users.findOne({ username }, "+password");

    // not exist, after throw http error
    if (!user) throw httpError(httpStatus.BAD_REQUEST, Messages.USER_NOT_EXIST);

    // check user password is valid or not
    const isPwdMatched = await user.isValidPassword(password);

    // given password not match and throw error
    if (!isPwdMatched) throw httpError.Unauthorized(Messages.USER_INFO_INVALID);

    // finally return user
    return user;
  }
}

export default new UserService();

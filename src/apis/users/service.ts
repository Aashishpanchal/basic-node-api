import httpError from "http-errors";
import httpStatus from "http-status";
import { Users, IUser } from "./models";

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

      if (user) throw httpError(httpStatus.BAD_REQUEST, "User Already Exist.");

      // after check create user document using create method
      const createdUser = await Users.create(data);
      // to return json data
      return createdUser.toJSON();
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
      throw httpError(httpStatus.BAD_REQUEST, "User do'nt Exist.");

    // return update user json
    return updatedUser.toJSON();
  }
  // findOne method to help get user document from mongodb database
  async findOne(id: string) {
    // find user data and get using findById, is required id argument
    const user = await Users.findById(id);

    // get or not after throw error
    if (!user) {
      throw new httpError.BadRequest("User not found");
    }
    // return user json
    return user.toJSON();
  }

  // findAll method to help get all user data document from mongodb database
  async findAll() {
    const users = await Users.find().select([
      "id",
      "username",
      "email",
      "first_name",
      "last_name",
    ]);

    return users;
  }
}

export default new UserService();

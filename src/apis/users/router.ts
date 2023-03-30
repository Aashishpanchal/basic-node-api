import { createRouter } from "../../core/custom-router";
import {
  UserCreateUpdateController,
  UserListController,
  UserRetrieveController,
  urlSuffix,
} from "./controllers";

const userRouter = createRouter([
  { controller: UserCreateUpdateController.asController() },
  { controller: UserListController.asController() },
  {
    url: `/:${urlSuffix}`,
    controller: UserRetrieveController.asController(),
  },
]);

export default userRouter;

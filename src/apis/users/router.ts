import { createRouter } from "../../core/custom-router";
import {
  UserCURController,
  UserListController,
  UserRetrieveController,
  urlSuffix,
} from "./controllers";

const userRouter = createRouter([
  { controller: UserCURController.asController() },
  { url: "/list", controller: UserListController.asController() },
  {
    url: `/:${urlSuffix}`,
    controller: UserRetrieveController.asController(),
  },
]);

export default userRouter;

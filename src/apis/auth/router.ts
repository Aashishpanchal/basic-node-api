import { createRouter } from "../../core/custom-router";
import AuthController from "./controllers";

const authRouter = createRouter([
  { url: "/", controller: AuthController.asController() },
]);

export default authRouter;

import { createRouter } from "../core/custom-router";
import authRouter from "./auth/router";
import userRouter from "./users/router";

const apiRouter = createRouter([
  { url: "/users", childRouter: userRouter },
  { url: "/auth", childRouter: authRouter },
]);

export default apiRouter;

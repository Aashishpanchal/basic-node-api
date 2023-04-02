import { createRouter } from "../core/custom-router";
import tokenRouter from "./token/router";
import userRouter from "./users/router";

const apiRouter = createRouter([
  { url: "/users", childRouter: userRouter },
  { url: "/token", childRouter: tokenRouter },
]);

export default apiRouter;

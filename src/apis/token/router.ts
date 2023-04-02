import { createRouter } from "../../core/custom-router";
import { CreDelTokenController, RefreshTokenController } from "./controllers";

const tokenRouter = createRouter([
  { controller: CreDelTokenController.asController() },
  { url: "/refresh", controller: RefreshTokenController.asController() },
]);

export default tokenRouter;

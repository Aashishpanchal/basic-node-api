import { Router, RouterOptions } from "express";
import { Controller } from "./controller";

export interface Route {
  url?: string;
  controller?: Controller;
  childRouter?: Router;
}

// function handler controller http-methods
export function createRouter(routes: Route[], options?: RouterOptions): Router {
  const router = Router(options);

  routes.forEach(({ url = "", controller, childRouter }) => {
    if (typeof childRouter === "function") {
      router.use(url, childRouter);
      return;
    } else {
      if (controller instanceof Controller && controller?.map instanceof Map) {
        return controller.map.forEach((value, key) => {
          const path = `${url}/${controller.getSuffix(key)}`.replace("//", "/");
          router.route(path)[key](...value);
        });
      }
    }
  });

  return router;
}

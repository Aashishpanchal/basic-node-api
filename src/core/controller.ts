import {
  RequestHandler,
  IRoute,
  Request,
  Response,
  NextFunction,
} from "express";

export type HTTPMethod = keyof IRoute;

// basic controller class, it's handle http-methods
export class Controller {
  declare map: Map<keyof IRoute, RequestHandler[]>;
  middlewares: RequestHandler[] = [];
  urlSuffix: string = "id";

  protected httpMethodNames: HTTPMethod[] = [
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "head",
    "options",
    "trace",
  ];

  static asController() {
    const instance = new this();
    const map = new Map<keyof IRoute, RequestHandler[]>();

    const methods = instance.getAllowedMethods();

    methods.forEach((method) => {
      const handler = instance
        .setWrapper(method)
        .call(instance, (instance as any)[method]);
      map.set(method, [
        ...instance.setMiddlewares(method),
        ...instance.middlewares,
        handler,
      ]);
    });

    instance.map = map;

    return instance;
  }

  getAllowedMethods(): HTTPMethod[] {
    return this.httpMethodNames.filter(
      (httpMethod) => typeof (this as any)[httpMethod] === "function"
    );
  }

  async options(request: Request, response: Response): Promise<Response> {
    const allowedMethods = this.getAllowedMethods();
    response.setHeader("Allow", allowedMethods.join(", "));
    response.setHeader("Content-Length", "0");
    return response.status(200).send();
  }

  getSuffix(method: HTTPMethod) {
    const suffix = `:${this.urlSuffix}`;
    if (method === "put") return suffix;
    else if (method === "patch") return suffix;
    else if (method === "delete") return suffix;
    return "";
  }

  protected catchError(callback: RequestHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(callback.call(this, req, res, next)).catch(next);
    };
  }

  setWrapper(method: HTTPMethod) {
    return this.catchError;
  }

  setMiddlewares(method: HTTPMethod): RequestHandler[] {
    return [];
  }
}

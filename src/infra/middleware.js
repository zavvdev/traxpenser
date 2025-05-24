import { AppError } from "./errors.js";
import { errorResponse } from "./utilities.js";

var createMiddlewareResult = (result) => {
  var next = {};
  result.forEach(({ name, data }) => {
    next[name] = data;
  });
  return next;
};

export var withMiddlewares =
  (...middlewares) =>
  (executor) =>
  async (...args) => {
    var res = args[1];

    try {
      var result = await Promise.all(
        middlewares.map((middleware) => middleware(...args)),
      );
      return await executor({
        req: args[0],
        res,
        middleware: createMiddlewareResult(result),
      });
    } catch (error) {
      console.error(error);

      if (error instanceof AppError) {
        return errorResponse(res)(error.payload, error.message);
      }

      return errorResponse(res)(null, error.message);
    }
  };

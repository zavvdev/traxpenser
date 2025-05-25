import { extractDatabaseError } from "./database/utilities.js";
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

      var databaseError = extractDatabaseError(error);

      if (databaseError) {
        return errorResponse(res)(databaseError.data, databaseError.message);
      }

      return errorResponse(res)(null, error.message);
    }
  };

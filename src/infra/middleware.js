import { MESSAGES, MESSAGES_LIST } from "./config.js";
import { errorResponse } from "./utilities.js";

export class MiddlewareError extends Error {
  /**
   * @param {string} message
   * @param {(object | undefined)} response
   */
  constructor(message, payload = {}) {
    super(message);
    this.name = "MiddlewareError";
    this.payload = payload || {};
  }
}

var createMiddlewareResult = (result) =>
  result.reduce((c, { name, data }) => ({ ...c, [name]: data }), {});

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

      if (error instanceof MiddlewareError) {
        return errorResponse(res)(
          error.payload,
          error.message || MESSAGES.unexpectedError,
        );
      }

      return errorResponse(res)(
        null,
        MESSAGES_LIST.includes(error.message)
          ? error.message
          : MESSAGES.unexpectedError,
      );
    }
  };

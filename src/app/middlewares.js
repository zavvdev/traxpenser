import { AUTH_HEADER, MESSAGES } from "../infra/config.js";
import { AppError } from "../infra/errors.js";
import { RevokedToken } from "./models/RevokedToken.js";
import { Session } from "./models/Session.js";
import { User } from "./models/User.js";

export async function auth(req) {
  try {
    var token = req.headers[AUTH_HEADER];

    if (!token) {
      throw new Error();
    }

    var revokedToken = await RevokedToken.findOne({ token });

    if (revokedToken) {
      throw new Error();
    }

    var session = await Session.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      throw new Error();
    }

    return {
      name: "auth",
      data: await User.findById(session.userId),
    };
  } catch {
    throw new AppError(MESSAGES.unauthorized);
  }
}

export function validBody(schema) {
  return async (req) => {
    try {
      var data = schema.validateSync(req.body, { strict: true });
      return {
        name: "validBody",
        data,
      };
    } catch (e) {
      throw new AppError(
        MESSAGES.validationError,
        e.path && e.message
          ? {
              [e.path]: e.message,
            }
          : null,
      );
    }
  };
}

import { AUTH_HEADER, MESSAGES } from "../infra/config.js";
import { AppError } from "../infra/errors.js";
import { RevokedToken } from "./models/RevokedToken.js";
import { Session } from "./models/Session.js";
import { Settings } from "./models/Settings.js";
import { extractSchemaValidationError } from "./utilities.js";

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

    var settings = await Settings.findOne({ user: session.user }).populate(
      "user",
    );

    if (!settings) {
      throw new Error();
    }

    return {
      name: "auth",
      data: {
        id: settings.user._id,
        username: settings.user.username,
        settings: {
          currency: settings.currency,
        },
      },
    };
  } catch (e) {
    console.error("Authentication error:", e);
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
        extractSchemaValidationError(e),
      );
    }
  };
}

export function validQuery(schema) {
  return async (req) => {
    try {
      var data = schema.validateSync(req.query, { strict: false });
      return {
        name: "validQuery",
        data,
      };
    } catch (e) {
      throw new AppError(
        MESSAGES.validationError,
        extractSchemaValidationError(e),
      );
    }
  };
}

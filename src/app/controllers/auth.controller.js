import { AUTH_HEADER, MESSAGES } from "../../infra/config.js";
import { db } from "../../infra/database/index.js";
import { encryptionService } from "../../infra/services/encryption.service.js";
import { errorResponse, successResponse } from "../../infra/utilities.js";
import { RevokedToken } from "../models/RevokedToken.js";
import { Session } from "../models/Session.js";
import { DEFAULT_SETTINGS, Settings } from "../models/Settings.js";
import { User } from "../models/User.js";

async function register({ res, middleware }) {
  var session = await db.startSession();

  try {
    session.startTransaction();

    var { username, password } = middleware.validBody;
    var hashedPassword = await encryptionService.hash(password);

    var { 0: user } = await User.create(
      [
        {
          username,
          password: hashedPassword,
        },
      ],
      { session },
    );

    await Settings.create(
      [
        {
          user: user._id,
          currency: DEFAULT_SETTINGS.currency,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res)(null, MESSAGES.ok);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();

    throw e;
  }
}

async function login({ res, middleware }) {
  var { username, password } = middleware.validBody;

  var user = await User.findOne({ username }).select("+password");

  if (
    !user ||
    !(await encryptionService.compareHashes(password, user.password))
  ) {
    return errorResponse(res)(null, MESSAGES.invalidCredentials);
  }

  var token = encryptionService.getUniqueId();

  await Session.create({
    user: user._id,
    token,
  });

  return successResponse(res)({ token }, MESSAGES.ok);
}

async function logout({ req, res }) {
  var session = await db.startSession();

  try {
    session.startTransaction();

    var token = req.headers[AUTH_HEADER];

    await RevokedToken.create(
      [
        {
          token,
        },
      ],
      { session },
    );

    await Session.deleteOne({ token }, { session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res)(null, MESSAGES.ok);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();

    throw e;
  }
}

export var authController = {
  register,
  login,
  logout,
};

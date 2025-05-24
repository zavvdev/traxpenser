import { AUTH_HEADER, MESSAGES } from "../../infra/config.js";
import { db } from "../../infra/database/index.js";
import { encryptionService } from "../../infra/services/encryption.service.js";
import { errorResponse, successResponse } from "../../infra/utilities.js";
import { RevokedToken } from "../models/RevokedToken.js";
import { Session } from "../models/Session.js";
import { User } from "../models/User.js";

async function register({ res, middleware }) {
  var { username, password } = middleware.validBody;

  var hashedPassword = await encryptionService.hash(password);

  await User.create({
    username,
    password: hashedPassword,
  });

  return successResponse(res)(null, MESSAGES.ok);
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
    userId: user._id,
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

    await Session.deleteOne({ token }).session(session);

    await session.commitTransaction();
    return successResponse(res)(null, MESSAGES.ok);
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
}

export var authController = {
  register,
  login,
  logout,
};

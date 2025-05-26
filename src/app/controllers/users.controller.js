import { MESSAGES } from "../../infra/config.js";
import { successResponse } from "../../infra/utilities.js";
import { User } from "../models/User.js";

async function getMe({ res, middleware }) {
  var { auth } = middleware;
  var user = await User.findById(auth.id);
  return successResponse(res)(user, MESSAGES.ok);
}

export var usersController = {
  getMe,
};

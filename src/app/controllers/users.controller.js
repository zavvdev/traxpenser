import { MESSAGES } from "../../infra/config.js";
import { db } from "../../infra/database/index.js";
import { successResponse } from "../../infra/utilities.js";
import { Category } from "../models/Category.js";
import { Expense } from "../models/Expense.js";
import { Session } from "../models/Session.js";
import { Settings } from "../models/Settings.js";
import { User } from "../models/User.js";

async function getMe({ res, middleware }) {
  var { auth } = middleware;
  var user = await User.findById(auth.id);
  return successResponse(res)(user, MESSAGES.ok);
}

async function deleteMe({ res, middleware }) {
  var session = await db.startSession();

  try {
    session.startTransaction();

    var { auth } = middleware;

    await Expense.deleteMany({ user: auth.id }, { session });
    await Category.deleteMany({ user: auth.id }, { session });
    await Session.deleteOne({ user: auth.id }, { session });
    await Settings.deleteOne({ user: auth.id }, { session });
    await User.deleteOne({ _id: auth.id }, { session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res)(null, MESSAGES.ok);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();

    throw e;
  }
}

export var usersController = {
  getMe,
  deleteMe,
};

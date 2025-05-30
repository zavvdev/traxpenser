import { MESSAGES } from "../../infra/config.js";
import { successResponse } from "../../infra/utilities.js";
import { Settings } from "../models/Settings.js";

async function get({ res, middleware }) {
  var { auth } = middleware;
  var settings = await Settings.findOne({ user: auth.id }).select("-_id");
  return successResponse(res)(settings, MESSAGES.ok);
}

async function update({ res, middleware }) {
  var { auth, validBody } = middleware;

  var { currency } = validBody;

  var settings = await Settings.findOneAndUpdate(
    { user: auth.id },
    { currency },
    { new: true, upsert: true },
  ).select("-_id");

  return successResponse(res)(settings, MESSAGES.ok);
}

export var settingsController = {
  get,
  update,
};

import { MESSAGES } from "../config.js";

export function extractDatabaseError(error) {
  var m = error.message;

  if (m.includes("duplicate key error collection")) {
    return {
      message: MESSAGES.alreadyExists,
      data: error.errorResponse?.keyValue || null,
    };
  }

  return null;
}

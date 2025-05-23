import { MESSAGES, RESPONSE_STATUS, STATUS_BY_MESSAGE } from "./config.js";

var msg = (m) => (fallback) => (typeof m === "string" ? m : fallback);

export var errorResponse = (res) => (data, message) =>
  res.status(STATUS_BY_MESSAGE[message] || 500).json({
    status: RESPONSE_STATUS.error,
    message: msg(message)(MESSAGES.unexpectedError),
    data: data || null,
  });

export var successResponse = (res) => (data, message) =>
  res.status(STATUS_BY_MESSAGE[message] || 200).json({
    status: RESPONSE_STATUS.success,
    message: msg(message)(MESSAGES.ok),
    data: data || null,
  });

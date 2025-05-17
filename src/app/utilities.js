import { firstValueFrom } from "rxjs";
import { MESSAGES, RESPONSE_STATUS } from "./config.js";

var msg = (m) => (fallback) => (typeof m === "string" ? m : fallback);

export var errorResponse = (res) => (data, message, status) =>
  res.status(status || 500).json({
    status: RESPONSE_STATUS.error,
    message: msg(message)(MESSAGES.unexpectedError),
    data: data ?? null,
  });

export var successResponse = (res) => (data, message, status) =>
  res.status(status || 200).json({
    status: RESPONSE_STATUS.success,
    message: msg(message)(MESSAGES.ok),
    data: data ?? null,
  });

export var handler =
  (executor) =>
  async (...args) => {
    return await firstValueFrom(await executor(...args));
  };

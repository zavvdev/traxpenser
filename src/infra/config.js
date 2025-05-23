export var APP_PORT = process.env.APP_PORT || 8000;

export var DB_NAME = process.env.DB_NAME;
export var DB_USER = process.env.DB_USER;
export var DB_PASS = process.env.DB_PASS;
export var DB_HOST = process.env.DB_HOST;
export var DB_PORT = process.env.DB_PORT;

export var AUTH_HEADER = "authorization";

export var RESPONSE_STATUS = {
  error: "error",
  success: "success",
};

export var MESSAGES = {
  ok: "ok",
  unexpectedError: "unexpected_error",
  unauthorized: "unauthorized",
  validationError: "validation_error",
  invalidCredentials: "invalid_credentials",
  notFound: "not_found",
};

export var MESSAGES_LIST = Object.values(MESSAGES);

export var VALIDATION_MESSAGES = {
  required: "required",
  typeString: "type_string",
  minLength: "min_length",
};

export var STATUS_BY_MESSAGE = {
  [MESSAGES.ok]: 200,
  [MESSAGES.unexpectedError]: 500,
  [MESSAGES.unauthorized]: 401,
  [MESSAGES.validationError]: 400,
  [MESSAGES.invalidCredentials]: 404,
  [MESSAGES.notFound]: 404,
};

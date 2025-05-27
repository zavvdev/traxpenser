export var APP_PORT = process.env.APP_PORT || 8000;

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
  created: "created",
  alreadyExists: "already_exists",
  categoryNotFound: "category_not_found",
  budgetLimitExceeded: "budget_limit_exceeded",
  categodyRequired: "category_required",
  invalidRequest: "invalid_request",
};

export var MESSAGES_LIST = Object.values(MESSAGES);

export var VALIDATION_MESSAGES = {
  required: "required",
  typeString: "type_string",
  typeNumber: "type_number",
  typeBoolean: "type_boolean",
  minLength: "min_length",
  invalid: "invalid",
  min: "min",
  max: "max",
};

export var STATUS_BY_MESSAGE = {
  [MESSAGES.ok]: 200,
  [MESSAGES.unexpectedError]: 500,
  [MESSAGES.unauthorized]: 401,
  [MESSAGES.validationError]: 400,
  [MESSAGES.invalidCredentials]: 404,
  [MESSAGES.notFound]: 404,
  [MESSAGES.created]: 201,
  [MESSAGES.alreadyExists]: 409,
  [MESSAGES.categoryNotFound]: 404,
  [MESSAGES.budgetLimitExceeded]: 400,
  [MESSAGES.categodyRequired]: 400,
  [MESSAGES.invalidRequest]: 400,
};

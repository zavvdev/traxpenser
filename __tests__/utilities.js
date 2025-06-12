import { expect } from "vitest";
import { MESSAGES, RESPONSE_STATUS } from "../src/infra/config";
import request from "supertest";
import { app } from "../src/index.js";
import { ROUTES } from "../src/routes.js";
import { LOGIN_CREDS } from "./config.js";

export var assertSuccessResponse =
  (res) =>
  ({ code, message, data } = {}) => {
    expect(res.statusCode).toEqual(code || 200);
    expect(res.body.status).toEqual(RESPONSE_STATUS.success);
    expect(res.body.message).toEqual(message || MESSAGES.ok);

    if (data) {
      expect(res.body.data).toEqual(data);
    }
  };

export var assertErrorResponse =
  (res) =>
  ({ code, message, data }) => {
    expect(res.statusCode).toEqual(code || 500);
    expect(res.body.status).toEqual(RESPONSE_STATUS.error);
    expect(res.body.message).toEqual(message || MESSAGES.unexpectedError);

    if (data) {
      expect(res.body.data).toEqual(data);
    }
  };

/**
 * @returns {Promise<string>}
 */
export var login = async () => {
  await request(app).post(ROUTES.auth.register()).send(LOGIN_CREDS);
  var res = await request(app).post(ROUTES.auth.login()).send(LOGIN_CREDS);
  return res.body.data.token;
};

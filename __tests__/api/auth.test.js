import request from "supertest";
import { describe, it } from "vitest";
import { expect } from "vitest";
import { app } from "../../src/index.js";
import { AUTH_HEADER, MESSAGES } from "../../src/infra/config.js";
import { ROUTES } from "../../src/routes.js";
import { LOGIN_CREDS } from "../config.js";
import {
  assertErrorResponse,
  assertSuccessResponse,
  login,
} from "../utilities.js";

describe("Auth API", () => {
  describe("Register", () => {
    it("should register a new user", async () => {
      var res = await request(app)
        .post(ROUTES.auth.register())
        .send(LOGIN_CREDS);
      assertSuccessResponse(res)();
    });

    it("should not register a user with existing username", async () => {
      await request(app).post(ROUTES.auth.register()).send(LOGIN_CREDS);

      var res = await request(app)
        .post(ROUTES.auth.register())
        .send(LOGIN_CREDS);

      assertErrorResponse(res)({
        code: 409,
        message: MESSAGES.alreadyExists,
      });
    });
  });

  describe("Login", () => {
    it("should login registered user", async () => {
      await request(app).post(ROUTES.auth.register()).send(LOGIN_CREDS);
      var res = await request(app).post(ROUTES.auth.login()).send(LOGIN_CREDS);

      expect(res.body.data.token).toBeDefined();

      assertSuccessResponse(res)({
        message: MESSAGES.ok,
      });
    });

    it("should not login unregistered user", async () => {
      var res = await request(app).post(ROUTES.auth.login()).send(LOGIN_CREDS);

      assertErrorResponse(res)({
        code: 404,
        message: MESSAGES.invalidCredentials,
      });
    });
  });

  describe("Logout", () => {
    it("should logout user", async () => {
      var token = await login();

      var res = await request(app)
        .delete(ROUTES.auth.logout())
        .set(AUTH_HEADER, token);

      assertSuccessResponse(res)({
        message: MESSAGES.ok,
      });
    });

    it("should expire token after logout", async () => {
      var token = await login();

      await request(app).delete(ROUTES.auth.logout()).set(AUTH_HEADER, token);

      var res = await request(app)
        .delete(ROUTES.auth.logout())
        .set(AUTH_HEADER, token);

      assertErrorResponse(res)({
        code: 401,
        message: MESSAGES.unauthorized,
      });
    });
  });
});

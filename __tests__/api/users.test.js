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

describe("Users API", () => {
  describe(`GET ${ROUTES.users.me()}`, () => {
    it("should get users data", async () => {
      var res = await request(app)
        .get(ROUTES.users.me())
        .set(AUTH_HEADER, await login());

      expect(res.body.data.username).toEqual(LOGIN_CREDS.username);
    });
  });

  describe(`DELETE ${ROUTES.users.me()}`, () => {
    it("should delete users data", async () => {
      var token = await login();

      var res = await request(app)
        .delete(ROUTES.users.me())
        .set(AUTH_HEADER, token);

      assertSuccessResponse(res)();

      var res2 = await request(app)
        .get(ROUTES.users.me())
        .set(AUTH_HEADER, token);

      assertErrorResponse(res2)({
        code: 401,
        message: MESSAGES.unauthorized,
      });
    });
  });
});

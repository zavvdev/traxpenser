import request from "supertest";
import { describe, it } from "vitest";
import { expect } from "vitest";
import { CURRENCY, DEFAULT_SETTINGS } from "../../src/app/models/Settings.js";
import { app } from "../../src/index.js";
import {
  AUTH_HEADER,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "../../src/infra/config.js";
import { ROUTES } from "../../src/routes.js";
import {
  assertErrorResponse,
  assertSuccessResponse,
  login,
} from "../utilities.js";

describe("Settings API", () => {
  it("should get user settings", async () => {
    var res = await request(app)
      .get(ROUTES.settings.root())
      .set(AUTH_HEADER, await login());

    expect(res.body.data.currency).toEqual(DEFAULT_SETTINGS.currency);
  });

  it("should update user settings", async () => {
    var token = await login();

    var res = await request(app)
      .put(ROUTES.settings.root())
      .send({ currency: CURRENCY.PLN })
      .set(AUTH_HEADER, token);

    assertSuccessResponse(res)();

    var settings = await request(app)
      .get(ROUTES.settings.root())
      .set(AUTH_HEADER, token);

    expect(settings.body.data.currency).toEqual(CURRENCY.PLN);
  });

  it("should not update user settings with invalid currency", async () => {
    var token = await login();

    var res = await request(app)
      .put(ROUTES.settings.root())
      .send({ currency: "asd" })
      .set(AUTH_HEADER, token);

    assertErrorResponse(res)({
      code: 400,
      message: MESSAGES.validationError,
      data: {
        currency: VALIDATION_MESSAGES.invalid,
      },
    });
  });
});

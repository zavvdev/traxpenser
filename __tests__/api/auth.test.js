import { describe, it } from "vitest";
import request from "supertest";
import { app } from "../../src/index.js";
import { ROUTES } from "../../src/routes.js";
import { LOGIN_CREDS } from "../config.js";
import { assertSuccessResponse } from "../utilities.js";

describe("Auth API", () => {
  it("should register a new user", async () => {
    var res = await request(app).post(ROUTES.auth.register()).send(LOGIN_CREDS);
    assertSuccessResponse(res)();
  });
});

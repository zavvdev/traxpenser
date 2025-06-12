import { expect } from "vitest";
import { MESSAGES, RESPONSE_STATUS } from "../src/infra/config";

export var assertSuccessResponse =
  (res) =>
  ({ code, message, data } = {}) => {
    expect(res.statusCode).toEqual(code || 200);
    expect(res.body.status).toEqual(RESPONSE_STATUS.success);
    expect(res.body.message).toEqual(message || MESSAGES.ok);

    if (data) {
      expect(res.body.data).toEqual(data);
    } else {
      expect(res.body.data).toBeNull();
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
    } else {
      expect(res.body.data).toBeNull();
    }
  };

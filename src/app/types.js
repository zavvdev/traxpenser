import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../infra/config.js";
import { db } from "../infra/database/index.js";

export var Id = t
  .string()
  .length(24, T.invalid)
  .typeError(T.typeString)
  .required(T.required);

export var Price = t
  .number()
  .min(0, T.min)
  .max(Number.MAX_SAFE_INTEGER, T.max)
  .typeError(T.typeNumber);

export var DateString = t.string().test({
  message: T.invalid,
  test: (value) => {
    if (!value) {
      return true;
    }

    var isValid = new RegExp(/^\d{4}-\d{2}-\d{2}$/).test(value);

    if (isValid) {
      const month = Number.parseInt(value.split("-")[1]);
      return month >= 1 && month <= 12;
    }

    return false;
  },
});

export var ObjectId = {
  fromStringId: (id) => new db.Types.ObjectId(`${id}`),
};

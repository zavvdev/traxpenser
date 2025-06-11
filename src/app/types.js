import * as t from "yup";
import {
  MESSAGES as M,
  PRICE_PRECISION,
  VALIDATION_MESSAGES as T,
} from "../infra/config.js";
import { db } from "../infra/database/index.js";
import { AppError } from "../infra/errors.js";

var DbNumber = db.Types.Decimal128;

export var Id = t
  .string()
  .length(24, T.invalid)
  .typeError(T.typeString)
  .required(T.required);

export var Price = {
  test: (value) => {
    var normalLen = (x) => {
      var len = x.length;
      return x.includes(".")
        ? len <= PRICE_PRECISION
        : len <= PRICE_PRECISION - 1;
    };
    return new RegExp(/^\d+(\.\d+)?$/).test(value) && normalLen(value);
  },

  schema: (required = true) => {
    return t
      .string()
      .test({
        message: T.invalid,
        test: (value) => {
          if (!value && !required) {
            return true;
          }
          return Price.test(value);
        },
      })
      .typeError(T.typeString);
  },

  toDbValue: (value) => DbNumber.fromString(`${value}`),

  /**
   * @returns {string}
   */
  fromDbValue: (value) => {
    if (value instanceof DbNumber) {
      return value.toString();
    }
    if (Price.test(value)) {
      return value;
    }
    throw new AppError(M.unprocessableNumber);
  },
};

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

import { db } from "../index.js";
import { transformPlugin } from "./utilities.js";

export var transformDecimals = transformPlugin((_, value) => {
  var decimalFields = Object.keys(value).filter(
    (key) => value[key] instanceof db.Types.Decimal128,
  );

  decimalFields.forEach((field) => {
    value[field] = value[field].toString();
  });

  return value;
});

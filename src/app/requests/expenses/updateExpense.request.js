import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";
import { Price } from "../../types.js";

export var updateExpenseRequestSchema = t.object({
  name: t.string().required(T.required).typeError(T.typeString),
  description: t.string().nullable(),
  price: Price.schema(),
  isCompleted: t.boolean().typeError(T.typeBoolean).required(T.required),
});

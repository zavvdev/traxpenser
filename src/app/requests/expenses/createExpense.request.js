import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";
import { Id, Price } from "../../types.js";

export var createExpenseRequestSchema = t.object({
  categoryId: Id,
  name: t.string().required(T.required).typeError(T.typeString),
  description: t.string().nullable(),
  price: Price.schema(),
  isCompleted: t.boolean().default(false).typeError(T.typeBoolean),
});

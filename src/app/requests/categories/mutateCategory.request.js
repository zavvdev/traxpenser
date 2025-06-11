import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";
import { Price } from "../../types.js";

export var mutateCategoryRequestSchema = t.object({
  name: t.string().required(T.required).typeError(T.typeString),
  budgetLimit: Price.schema(false),
  allowOverBudget: t.boolean().default(false).typeError(T.typeBoolean),
});

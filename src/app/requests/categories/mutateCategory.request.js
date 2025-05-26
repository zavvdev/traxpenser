import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";

export var mutateCategoryRequestSchema = t.object({
  name: t.string().required(T.required).typeError(T.typeString),
  budgetLimit: t.number().min(0, T.minLength).nullable(),
  allowOverBudget: t.boolean().default(false).typeError(T.typeBoolean),
});

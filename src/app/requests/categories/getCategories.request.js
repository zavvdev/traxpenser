import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";
import { DateString } from "../../types.js";

export var getCategoriesRequestSchema = t.object({
  name: t.string().nullable(),
  minBudgetLimit: t.number().typeError(T.typeNumber).nullable(),
  maxBudgetLimit: t.number().typeError(T.typeNumber).nullable(),
  allowOverBudget: t.boolean().typeError(T.typeBoolean).nullable(),
  minDate: DateString.nullable(),
  maxDate: DateString.nullable(),
});

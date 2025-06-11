import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";
import { DateString, Price } from "../../types.js";

export var getCategoriesRequestSchema = t.object({
  name: t.string().nullable(),
  minBudgetLimit: Price.schema(false),
  maxBudgetLimit: Price.schema(false),
  allowOverBudget: t.boolean().typeError(T.typeBoolean).nullable(),
  minDate: DateString.nullable(),
  maxDate: DateString.nullable(),
});

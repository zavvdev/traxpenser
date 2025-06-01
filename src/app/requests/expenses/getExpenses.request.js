import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";
import { DateString, Id } from "../../types.js";

export var getExpensesRequestSchema = t.object({
  categoryId: Id.notRequired(),
  isCompleted: t.boolean().typeError(T.typeBoolean).nullable(),
  name: t.string().nullable(),
  minPrice: t.number().typeError(T.typeNumber).nullable(),
  maxPrice: t.number().typeError(T.typeNumber).nullable(),
  minDate: DateString.nullable(),
  maxDate: DateString.nullable(),
});

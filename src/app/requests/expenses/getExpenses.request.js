import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";
import { DateString, Id, Price } from "../../types.js";

export var getExpensesRequestSchema = t.object({
  categoryId: Id.notRequired(),
  isCompleted: t.boolean().typeError(T.typeBoolean).nullable(),
  name: t.string().nullable(),
  minPrice: Price.schema(false),
  maxPrice: Price.schema(false),
  minDate: DateString.nullable(),
  maxDate: DateString.nullable(),
});

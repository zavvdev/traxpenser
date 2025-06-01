import * as t from "yup";
import { DateString, Id } from "../../types.js";

export var getTotalExpensesPriceRequestSchema = t.object({
  categoryIds: t.array().of(Id).nullable(),
  minDate: DateString.nullable(),
  maxDate: DateString.nullable(),
});

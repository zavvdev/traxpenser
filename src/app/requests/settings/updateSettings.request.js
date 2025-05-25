import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";
import { CURRENCY } from "../../models/Settings.js";

export var updateSettingsRequestSchema = t.object({
  currency: t
    .string()
    .oneOf(Object.values(CURRENCY), T.invalid)
    .required(T.required)
    .typeError(T.typeString),
});

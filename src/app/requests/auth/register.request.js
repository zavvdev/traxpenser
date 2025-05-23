import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";

export var registerRequestSchema = t.object({
  username: t.string().required(T.required).typeError(T.typeString),
  password: t
    .string()
    .min(8, T.minLength)
    .required(T.required)
    .typeError(T.typeString),
});

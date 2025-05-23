import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../../../infra/config.js";

export var loginRequestSchema = t.object({
  username: t.string().required(T.required).typeError(T.typeString),
  password: t.string().required(T.required).typeError(T.typeString),
});

import * as t from "yup";
import { VALIDATION_MESSAGES as T } from "../infra/config.js";

export var Id = t
  .string()
  .length(24, T.invalid)
  .typeError(T.typeString)
  .required(T.required);

export var Price = t
  .number()
  .min(0, T.min)
  .max(Number.MAX_SAFE_INTEGER, T.max)
  .typeError(T.typeNumber);

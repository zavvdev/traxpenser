import { transformPlugin } from "./utilities.js";

export var transformInternals = transformPlugin((_, value) => {
  value.id = value._id;
  delete value._id;
  delete value.__v;
  return value;
});

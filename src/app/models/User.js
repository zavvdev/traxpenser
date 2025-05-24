import { db } from "../../infra/database/index.js";

var { Schema } = db;

export var User = db.model(
  "User",
  new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  }),
);

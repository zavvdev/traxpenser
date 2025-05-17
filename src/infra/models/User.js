import { db } from "../database/index.js";

var { Schema } = db;

export var User = db.model(
  "User",
  new Schema({
    username: String,
  }),
);

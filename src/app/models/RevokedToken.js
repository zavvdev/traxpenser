import { db } from "../../infra/database.js";

var { Schema } = db;

export var RevokedToken = db.model(
  "RevokedToken",
  new Schema({
    token: {
      type: String,
      required: true,
      unique: true,
    },
    revokedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  }),
);

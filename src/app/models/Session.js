import { db } from "../../infra/database/index.js";

var { Schema } = db;

export var Session = db.model(
  "Session",
  new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 60 * 60 * 1000,
      required: true,
    },
  }),
);

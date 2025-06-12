import { db } from "../../infra/database/index.js";

var { Schema } = db;

var schema = new Schema({
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
});

schema.index({ username: 1 }, { unique: true });

export var User = db.model("User", schema);

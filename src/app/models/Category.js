import { db } from "../../infra/database/index.js";

var { Schema } = db;

var schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    budgetLimit: {
      type: Schema.Types.Decimal128,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

schema.methods.isLimitless = function () {
  return this.budgetLimit === null || this.budgetLimit === undefined;
};

export var Category = db.model("Category", schema);

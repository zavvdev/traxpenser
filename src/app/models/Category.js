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
    allowOverBudget: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

schema.methods.isLimitless = function () {
  var noLimit = this.budgetLimit === null || this.budgetLimit === undefined;
  var allowOverBudget = this.allowOverBudget === true;
  return noLimit || allowOverBudget;
};

export var Category = db.model("Category", schema);

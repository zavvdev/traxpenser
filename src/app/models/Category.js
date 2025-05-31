import { db } from "../../infra/database/index.js";

var { Schema } = db;

var schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
    name: {
      type: String,
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

schema.index({ user: 1, name: 1 }, { unique: true });

function isLimitless({ budgetLimit, allowOverBudget }) {
  var noLimit = budgetLimit === null || budgetLimit === undefined;
  var overBudget = allowOverBudget === true;
  return noLimit || overBudget;
}

schema.methods.isLimitless = function () {
  return isLimitless(this);
};

schema.statics.isLimitless = (category) => isLimitless(category);

schema.methods.getBudgetLimit = function () {
  var budget = this.budgetLimit;
  if (budget) {
    return budget.toString();
  }
  return "0";
};

export var Category = db.model("Category", schema);

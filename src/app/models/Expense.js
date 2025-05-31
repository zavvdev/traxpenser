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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

schema.index({ user: 1, category: 1, name: 1 }, { unique: true });

export var Expense = db.model("Expense", schema);

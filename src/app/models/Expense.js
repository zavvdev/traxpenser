import { db } from "../../infra/database/index.js";

var { Schema } = db;

export var Expense = db.model(
  "Expense",
  new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false,
      },
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      name: {
        type: String,
        unique: true,
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
  ),
);

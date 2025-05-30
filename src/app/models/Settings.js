import { db } from "../../infra/database/index.js";

var { Schema } = db;

export var CURRENCY = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  UAH: "UAH",
  PLN: "PLN",
};

export var DEFAULT_SETTINGS = {
  currency: CURRENCY.USD,
};

export var Settings = db.model(
  "Settings",
  new Schema(
    {
      currency: {
        type: String,
        enum: Object.values(CURRENCY),
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false,
      },
    },
    {
      timestamps: true,
    },
  ),
);

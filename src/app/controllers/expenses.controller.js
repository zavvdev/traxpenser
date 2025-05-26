import Decimal from "decimal.js";
import * as R from "remeda";
import { MESSAGES } from "../../infra/config.js";
import { errorResponse, successResponse } from "../../infra/utilities.js";
import { Category } from "../models/Category.js";
import { Expense } from "../models/Expense.js";

async function createOne({ res, middleware }) {
  var { auth, validBody } = middleware;
  var { categoryId, name, description, price, isCompleted } = validBody;
  var category = await Category.findById(categoryId);

  if (!category) {
    return errorResponse(res)(null, MESSAGES.categoryNotFound);
  }

  var newExpense = {
    userId: auth.id,
    categoryId,
    name,
    description,
    price,
    isCompleted,
  };

  var create = async () =>
    successResponse(res)(await Expense.create(newExpense), MESSAGES.created);

  if (category.isLimitless()) {
    return await create();
  }

  var currentPrice = await Expense.aggregate([
    {
      $match: {
        userId: auth.id,
        categoryId: category._id,
      },
    },
    {
      $group: {
        _id: null,
        totalPrice: { $sum: "$price" },
      },
    },
  ]);

  currentPrice = currentPrice[0]?.totalPrice?.toString() || "0";

  var nextPrice = new Decimal(currentPrice).add(new Decimal(newExpense.price));

  if (new Decimal(nextPrice).greaterThan(category.budgetLimit.toString())) {
    return errorResponse(res)(null, MESSAGES.budgetLimitExceeded);
  }

  return await create();
}

async function getAll({ req, res, middleware }) {
  var { auth } = middleware;

  var { categoryId, isCompleted, name, minPrice, maxPrice } = req.query;

  if (!categoryId) {
    return errorResponse(res)(null, MESSAGES.categodyRequired);
  }

  var expenses = await Expense.find(
    R.omitBy(
      {
        userId: auth.id,
        categoryId,
        isCompleted:
          isCompleted !== undefined ? isCompleted === "true" : undefined,
        name: {
          $regex: name || "",
          $options: "i",
        },
        price: {
          $gte: minPrice || 0,
          $lte: maxPrice || Number.MAX_SAFE_INTEGER,
        },
      },
      R.isNullish,
    ),
  );

  return successResponse(res)(expenses, MESSAGES.ok);
}

export var expensesController = {
  createOne,
  getAll,
};

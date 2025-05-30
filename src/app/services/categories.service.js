import Decimal from "decimal.js";
import { Expense } from "../models/Expense.js";

async function canUpdateBudgetLimit(userId, categoryId, newCategory) {
  if (newCategory.allowOverBudget) {
    return true;
  }

  var currentPrice = await Expense.aggregate([
    {
      $match: {
        user: userId,
        category: categoryId,
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

  return new Decimal(currentPrice).lessThanOrEqualTo(
    newCategory.budgetLimit.toString(),
  );
}

export var categoriesService = {
  canUpdateBudgetLimit,
};

import Decimal from "decimal.js";
import { Expense } from "../models/Expense.js";

async function sumExpenses(userId, categoryId, excludedExpenseIds = []) {
  var currentPrice = await Expense.aggregate([
    {
      $match: {
        user: userId,
        category: categoryId,
        _id: { $nin: excludedExpenseIds },
      },
    },
    {
      $group: {
        _id: null,
        totalPrice: { $sum: "$price" },
      },
    },
  ]);

  return currentPrice[0]?.totalPrice?.toString() || "0";
}

async function canIncreaseExpenses(
  userId,
  category,
  newExpensePrice,
  editExpenseId,
) {
  if (category.isLimitless()) {
    return true;
  }

  var currentPrice = await sumExpenses(
    userId,
    category._id,
    editExpenseId ? [editExpenseId] : [],
  );

  var nextPrice = new Decimal(currentPrice).add(new Decimal(newExpensePrice));

  return new Decimal(nextPrice).lessThanOrEqualTo(category.getBudgetLimit());
}

export var expensesService = {
  sumExpenses,
  canIncreaseExpenses,
};

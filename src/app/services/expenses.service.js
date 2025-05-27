import Decimal from "decimal.js";
import { Expense } from "../models/Expense.js";

async function canAddExpense(userId, category, newExpensePrice) {
  if (category.isLimitless()) {
    return true;
  }

  var currentPrice = await Expense.aggregate([
    {
      $match: {
        userId: userId,
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
  var nextPrice = new Decimal(currentPrice).add(new Decimal(newExpensePrice));

  return new Decimal(nextPrice).lessThanOrEqualTo(
    category.budgetLimit.toString(),
  );
}

export var expensesService = {
  canAddExpense,
};

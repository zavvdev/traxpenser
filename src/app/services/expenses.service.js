import Decimal from "decimal.js";
import { Expense } from "../models/Expense.js";
import { getPeriodRangeSelector } from "../utilities.js";

async function sumExpenses({
  userId,
  categoryIds,
  excludedExpenseIds,
  minDate,
  maxDate,
}) {
  var currentPrice = await Expense.aggregate([
    {
      $match: {
        user: userId,
        category: categoryIds?.length
          ? { $in: categoryIds }
          : { $exists: true },
        _id: { $nin: excludedExpenseIds || [] },
        createdAt: getPeriodRangeSelector(minDate, maxDate),
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

  var currentPrice = await sumExpenses({
    userId,
    categoryIds: [category._id],
    excludedExpenseIds: editExpenseId ? [editExpenseId] : [],
  });

  var nextPrice = new Decimal(currentPrice).add(new Decimal(newExpensePrice));

  return new Decimal(nextPrice).lessThanOrEqualTo(category.getBudgetLimit());
}

export var expensesService = {
  sumExpenses,
  canIncreaseExpenses,
};

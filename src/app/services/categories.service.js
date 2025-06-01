import Decimal from "decimal.js";
import { Category } from "../models/Category.js";
import { expensesService } from "./expenses.service.js";

async function canUpdateBudgetLimit(userId, categoryId, categoryNewData) {
  if (Category.isLimitless(categoryNewData)) {
    return true;
  }

  var currentPrice = await expensesService.sumExpenses({
    userId,
    categoryIds: [categoryId],
  });

  return new Decimal(currentPrice).lessThanOrEqualTo(
    categoryNewData.budgetLimit.toString(),
  );
}

async function calculateAvailableBudget(userId, category) {
  var currentPrice = await expensesService.sumExpenses({
    userId,
    categoryIds: [category._id],
  });

  return {
    isLimitless: category.isLimitless(),
    availableBudget: new Decimal(category.getBudgetLimit()).minus(
      new Decimal(currentPrice),
    ),
  };
}

export var categoriesService = {
  canUpdateBudgetLimit,
  calculateAvailableBudget,
};

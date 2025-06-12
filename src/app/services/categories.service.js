import { numberService } from "../../infra/services/number.service.js";
import { Category } from "../models/Category.js";
import { Price } from "../types.js";
import { expensesService } from "./expenses.service.js";

async function canUpdateBudgetLimit(userId, categoryId, categoryNewData) {
  if (Category.isLimitless(categoryNewData)) {
    return true;
  }

  var currentPrice = await expensesService.sumExpenses({
    userId,
    categoryIds: [categoryId],
  });

  return numberService.lte(
    currentPrice,
    Price.fromDbValue(categoryNewData.budgetLimit),
  );
}

async function calculateAvailableBudget(userId, category) {
  var currentPrice = await expensesService.sumExpenses({
    userId,
    categoryIds: [category._id],
  });

  return {
    isLimitless: category.isLimitless(),
    availableBudget: numberService.minus(
      category.getBudgetLimit(),
      currentPrice,
    ),
  };
}

export var categoriesService = {
  canUpdateBudgetLimit,
  calculateAvailableBudget,
};

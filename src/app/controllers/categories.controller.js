import * as R from "remeda";
import { MESSAGES } from "../../infra/config.js";
import { errorResponse, successResponse } from "../../infra/utilities.js";
import { Category } from "../models/Category.js";
import { categoriesService } from "../services/categories.service.js";
import { Price } from "../types.js";
import { getPeriodRangeSelector } from "../utilities.js";

async function getAll({ res, middleware }) {
  var { auth, validQuery } = middleware;

  var {
    name,
    minBudgetLimit,
    maxBudgetLimit,
    allowOverBudget,
    minDate,
    maxDate,
  } = validQuery;

  var budgetLimitQuery =
    minBudgetLimit || maxBudgetLimit
      ? R.omitBy(
          {
            $gte: minBudgetLimit ? Price.toDbValue(minBudgetLimit) : undefined,
            $lte: maxBudgetLimit ? Price.toDbValue(maxBudgetLimit) : undefined,
          },
          R.isNullish,
        )
      : undefined;

  var categories = await Category.find(
    R.omitBy(
      {
        user: auth.id,
        name: {
          $regex: name || "",
          $options: "i",
        },
        budgetLimit: budgetLimitQuery,
        allowOverBudget,
        createdAt: getPeriodRangeSelector(minDate, maxDate),
      },
      R.isNullish,
    ),
  );

  return successResponse(res)(categories, MESSAGES.ok);
}

async function getOne({ req, res, middleware }) {
  var { auth } = middleware;
  var { id } = req.params;

  var category = await Category.findOne({ _id: id, user: auth.id });

  if (!category) {
    return errorResponse(res)(null, MESSAGES.notFound);
  }

  return successResponse(res)(category, MESSAGES.ok);
}

async function createOne({ res, middleware }) {
  var { auth, validBody } = middleware;
  var { name, budgetLimit } = validBody;

  var category = await Category.create({
    user: auth.id,
    name,
    budgetLimit: budgetLimit ? Price.toDbValue(budgetLimit) : null,
  });

  return successResponse(res)(category, MESSAGES.created);
}

async function updateOne({ req, res, middleware }) {
  var { auth, validBody } = middleware;
  var { id } = req.params;
  var { name, budgetLimit, allowOverBudget } = validBody;

  var category = await Category.findOne({ _id: id, user: auth.id });

  if (!category) {
    return errorResponse(res)(null, MESSAGES.notFound);
  }

  var categoryNewData = {
    name,
    budgetLimit: Price.toDbValue(
      budgetLimit !== undefined ? budgetLimit : category.budgetLimit,
    ),
    allowOverBudget: allowOverBudget ?? category.allowOverBudget,
  };

  if (
    !(await categoriesService.canUpdateBudgetLimit(
      auth.id,
      category._id,
      categoryNewData,
    ))
  ) {
    return errorResponse(res)(null, MESSAGES.budgetLimitExceeded);
  }

  var newCategory = await Category.updateOne(
    { _id: id, user: auth.id },
    categoryNewData,
    { new: true },
  );

  return successResponse(res)(newCategory, MESSAGES.ok);
}

async function deleteOne({ req, res, middleware }) {
  var { auth } = middleware;
  var { id } = req.params;

  var category = await Category.findOneAndDelete({ _id: id, user: auth.id });

  if (!category) {
    return errorResponse(res)(null, MESSAGES.notFound);
  }

  return successResponse(res)(null, MESSAGES.ok);
}

async function getAvailableBudget({ req, res, middleware }) {
  var { auth } = middleware;
  var { id } = req.params;

  var category = await Category.findOne({ _id: id, user: auth.id });

  if (!category) {
    return errorResponse(res)(null, MESSAGES.categoryNotFound);
  }

  var availableBudget = await categoriesService.calculateAvailableBudget(
    auth.id,
    category,
  );

  return successResponse(res)(availableBudget, MESSAGES.ok);
}

export var categoriesController = {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getAvailableBudget,
};

import { MESSAGES } from "../../infra/config.js";
import { errorResponse, successResponse } from "../../infra/utilities.js";
import { Category } from "../models/Category.js";
import { categoriesService } from "../services/categories.service.js";

async function getAll({ res, middleware }) {
  var { auth } = middleware;
  var categories = await Category.find({ user: auth.id });
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
    budgetLimit: budgetLimit || null,
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

  var nextCategoryData = {
    name,
    budgetLimit: budgetLimit ?? category.budgetLimit,
    allowOverBudget: allowOverBudget ?? category.allowOverBudget,
  };

  if (
    !(await categoriesService.canUpdateBudgetLimit(
      auth.id,
      category._id,
      nextCategoryData,
    ))
  ) {
    return errorResponse(res)(null, MESSAGES.budgetLimitExceeded);
  }

  var newCategory = await Category.updateOne(
    { _id: id, user: auth.id },
    { name, budgetLimit: budgetLimit || null, allowOverBudget },
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

export var categoriesController = {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};

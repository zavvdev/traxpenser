import { MESSAGES } from "../../infra/config.js";
import { errorResponse, successResponse } from "../../infra/utilities.js";
import { Category } from "../models/Category.js";

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

  var category = await Category.findOneAndUpdate(
    { _id: id, user: auth.id },
    { name, budgetLimit: budgetLimit || null, allowOverBudget },
    { new: true },
  );

  if (!category) {
    return errorResponse(res)(null, MESSAGES.notFound);
  }

  return successResponse(res)(category, MESSAGES.ok);
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

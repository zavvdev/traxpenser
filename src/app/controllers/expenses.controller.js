import * as R from "remeda";
import { MESSAGES } from "../../infra/config.js";
import { errorResponse, successResponse } from "../../infra/utilities.js";
import { Category } from "../models/Category.js";
import { Expense } from "../models/Expense.js";
import { expensesService } from "../services/expenses.service.js";
import { ObjectId, Price } from "../types.js";
import { getPeriodRangeSelector } from "../utilities.js";

async function updateOne({ req, res, middleware }) {
  var { auth, validBody } = middleware;
  var { id } = req.params;

  if (!id) {
    return errorResponse(res)(null, MESSAGES.invalidRequest);
  }

  var expense = await Expense.findOne({
    _id: id,
    user: auth.id,
  }).populate("category");

  if (!expense) {
    return errorResponse(res)(null, MESSAGES.notFound);
  }

  if (
    !(await expensesService.canIncreaseExpenses(
      auth.id,
      expense.category,
      validBody.price,
      expense._id,
    ))
  ) {
    return errorResponse(res)(null, MESSAGES.budgetLimitExceeded);
  }

  await Expense.updateOne(
    { _id: id, user: auth.id, category: expense.category._id },
    {
      ...validBody,
      price: Price.toDbValue(validBody.price),
    },
    { new: true },
  );

  return successResponse(res)(null, MESSAGES.ok);
}

async function createOne({ res, middleware }) {
  var { auth, validBody } = middleware;
  var { categoryId, name, description, price, isCompleted } = validBody;
  var category = await Category.findOne({ _id: categoryId, user: auth.id });

  if (!category) {
    return errorResponse(res)(null, MESSAGES.categoryNotFound);
  }

  var newExpense = {
    user: auth.id,
    category: categoryId,
    name,
    description,
    price: Price.toDbValue(price),
    isCompleted,
  };

  if (
    !(await expensesService.canIncreaseExpenses(
      auth.id,
      category,
      newExpense.price,
    ))
  ) {
    return errorResponse(res)(null, MESSAGES.budgetLimitExceeded);
  }

  return successResponse(res)(
    await Expense.create(newExpense),
    MESSAGES.created,
  );
}

async function getAll({ res, middleware }) {
  var { auth, validQuery } = middleware;

  var { categoryId, isCompleted, name, minPrice, maxPrice, minDate, maxDate } =
    validQuery;

  var priceQuery =
    minPrice || maxPrice
      ? R.omitBy(
          {
            $gte: minPrice ? Price.toDbValue(minPrice) : undefined,
            $lte: maxPrice ? Price.toDbValue(maxPrice) : undefined,
          },
          R.isNullish,
        )
      : undefined;

  var expenses = await Expense.find(
    R.omitBy(
      {
        user: auth.id,
        category: categoryId,
        isCompleted,
        name: {
          $regex: name || "",
          $options: "i",
        },
        price: priceQuery,
        createdAt: getPeriodRangeSelector(minDate, maxDate),
      },
      R.isNullish,
    ),
  ).populate("category");

  return successResponse(res)(expenses, MESSAGES.ok);
}

async function getOne({ req, res, middleware }) {
  var { auth } = middleware;
  var { id } = req.params;

  var expense = await Expense.findOne({ _id: id, user: auth.id }).populate(
    "category",
  );

  if (!expense) {
    return errorResponse(res)(null, MESSAGES.notFound);
  }

  return successResponse(res)(expense, MESSAGES.ok);
}

async function deleteOne({ req, res, middleware }) {
  var { auth } = middleware;
  var { id } = req.params;

  var expense = await Expense.findOneAndDelete({ _id: id, user: auth.id });

  if (!expense) {
    return errorResponse(res)(null, MESSAGES.notFound);
  }

  return successResponse(res)(null, MESSAGES.ok);
}

async function getTotalPrice({ res, middleware }) {
  var { auth, validQuery } = middleware;
  var { categoryIds, minDate, maxDate } = validQuery;

  var total = await expensesService.sumExpenses({
    userId: auth.id,
    categoryIds: categoryIds?.map(ObjectId.fromStringId) || [],
    minDate,
    maxDate,
  });

  return successResponse(res)(total, MESSAGES.ok);
}

export var expensesController = {
  createOne,
  updateOne,
  getOne,
  getAll,
  deleteOne,
  getTotalPrice,
};

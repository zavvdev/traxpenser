import express from "express";

import { authController } from "./app/controllers/auth.controller.js";
import { categoriesController } from "./app/controllers/categories.controller.js";
import { expensesController } from "./app/controllers/expenses.controller.js";
import { settingsController } from "./app/controllers/settings.controller.js";
import { usersController } from "./app/controllers/users.controller.js";
import { auth, validBody, validQuery } from "./app/middlewares.js";
import { loginRequestSchema } from "./app/requests/auth/login.request.js";
import { registerRequestSchema } from "./app/requests/auth/register.request.js";
import { getCategoriesRequestSchema } from "./app/requests/categories/getCategories.request.js";
import { mutateCategoryRequestSchema } from "./app/requests/categories/mutateCategory.request.js";
import { createExpenseRequestSchema } from "./app/requests/expenses/createExpense.request.js";
import { getExpensesRequestSchema } from "./app/requests/expenses/getExpenses.request.js";
import { getTotalExpensesPriceRequestSchema } from "./app/requests/expenses/getTotalExpensesPrices.request.js";
import { updateExpenseRequestSchema } from "./app/requests/expenses/updateExpense.request.js";
import { updateSettingsRequestSchema } from "./app/requests/settings/updateSettings.request.js";
import { APP_PORT } from "./infra/config.js";
import { withMiddlewares } from "./infra/middleware.js";
import { ROUTES } from "./routes.js";

export var app = (() => {
  var app = express();

  app.use(express.json());

  // Auth

  app.post(
    ROUTES.auth.register(),
    withMiddlewares(validBody(registerRequestSchema))(authController.register),
  );

  app.post(
    ROUTES.auth.login(),
    withMiddlewares(validBody(loginRequestSchema))(authController.login),
  );

  app.delete(
    ROUTES.auth.logout(),
    withMiddlewares(auth)(authController.logout),
  );

  // Users

  app.get(ROUTES.users.me(), withMiddlewares(auth)(usersController.getMe));

  app.delete(
    ROUTES.users.me(),
    withMiddlewares(auth)(usersController.deleteMe),
  );

  // Settings

  app.get(
    ROUTES.settings.root(),
    withMiddlewares(auth)(settingsController.get),
  );

  app.put(
    ROUTES.settings.root(),
    withMiddlewares(
      auth,
      validBody(updateSettingsRequestSchema),
    )(settingsController.update),
  );

  // Categories

  app.get(
    ROUTES.categories.root(),
    withMiddlewares(
      auth,
      validQuery(getCategoriesRequestSchema),
    )(categoriesController.getAll),
  );

  app.get(
    ROUTES.categories.one(":id"),
    withMiddlewares(auth)(categoriesController.getOne),
  );

  app.post(
    ROUTES.categories.root(),
    withMiddlewares(
      auth,
      validBody(mutateCategoryRequestSchema),
    )(categoriesController.createOne),
  );

  app.put(
    ROUTES.categories.one(":id"),
    withMiddlewares(
      auth,
      validBody(mutateCategoryRequestSchema),
    )(categoriesController.updateOne),
  );

  app.delete(
    ROUTES.categories.one(":id"),
    withMiddlewares(auth)(categoriesController.deleteOne),
  );

  app.get(
    ROUTES.categories.availableBudget(":id"),
    withMiddlewares(auth)(categoriesController.getAvailableBudget),
  );

  // Expenses

  app.post(
    ROUTES.expenses.root(),
    withMiddlewares(
      auth,
      validBody(createExpenseRequestSchema),
    )(expensesController.createOne),
  );

  app.get(
    ROUTES.expenses.root(),
    withMiddlewares(
      auth,
      validQuery(getExpensesRequestSchema),
    )(expensesController.getAll),
  );

  app.get(
    ROUTES.expenses.totalPrice(),
    withMiddlewares(
      auth,
      validQuery(getTotalExpensesPriceRequestSchema),
    )(expensesController.getTotalPrice),
  );

  app.get(
    ROUTES.expenses.one(":id"),
    withMiddlewares(auth)(expensesController.getOne),
  );

  app.put(
    ROUTES.expenses.one(":id"),
    withMiddlewares(
      auth,
      validBody(updateExpenseRequestSchema),
    )(expensesController.updateOne),
  );

  app.delete(
    ROUTES.expenses.one(":id"),
    withMiddlewares(auth)(expensesController.deleteOne),
  );

  // ==========

  app.listen(APP_PORT, () => {
    console.log(`Started on port ${APP_PORT}`);
    console.log("Mode:", process.env.NODE_ENV);
  });

  return app;
})();

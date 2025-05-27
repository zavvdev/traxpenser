import express from "express";
import "dotenv/config";

import { authController } from "./app/controllers/auth.controller.js";
import { categoriesController } from "./app/controllers/categories.controller.js";
import { expensesController } from "./app/controllers/expenses.controller.js";
import { settingsController } from "./app/controllers/settings.controller.js";
import { usersController } from "./app/controllers/users.controller.js";
import { auth, validBody } from "./app/middlewares.js";
import { loginRequestSchema } from "./app/requests/auth/login.request.js";
import { registerRequestSchema } from "./app/requests/auth/register.request.js";
import { mutateCategoryRequestSchema } from "./app/requests/categories/mutateCategory.request.js";
import { createExpenseRequestSchema } from "./app/requests/expenses/createExpense.request.js";
import { updateExpenseRequestSchema } from "./app/requests/expenses/updateExpense.request.js";
import { updateSettingsRequestSchema } from "./app/requests/settings/updateSettings.request.js";
import { APP_PORT } from "./infra/config.js";
import { withMiddlewares } from "./infra/middleware.js";

(() => {
  var api = (path) => `/api/v1${path}`;
  var app = express();

  app.use(express.json());

  // Auth

  app.post(
    api("/auth/register"),
    withMiddlewares(validBody(registerRequestSchema))(authController.register),
  );

  app.post(
    api("/auth/login"),
    withMiddlewares(validBody(loginRequestSchema))(authController.login),
  );

  app.delete(api("/auth/logout"), withMiddlewares(auth)(authController.logout));

  // Users

  app.get(api("/me"), withMiddlewares(auth)(usersController.getMe));

  // Settings

  app.get(api("/settings"), withMiddlewares(auth)(settingsController.get));

  app.put(
    api("/settings"),
    withMiddlewares(
      auth,
      validBody(updateSettingsRequestSchema),
    )(settingsController.update),
  );

  // Categories

  app.get(
    api("/categories"),
    withMiddlewares(auth)(categoriesController.getAll),
  );

  app.get(
    api("/categories/:id"),
    withMiddlewares(auth)(categoriesController.getOne),
  );

  app.post(
    api("/categories"),
    withMiddlewares(
      auth,
      validBody(mutateCategoryRequestSchema),
    )(categoriesController.createOne),
  );

  app.put(
    api("/categories/:id"),
    withMiddlewares(
      auth,
      validBody(mutateCategoryRequestSchema),
    )(categoriesController.updateOne),
  );

  app.delete(
    api("/categories/:id"),
    withMiddlewares(auth)(categoriesController.deleteOne),
  );

  // Expenses

  app.post(
    api("/expenses"),
    withMiddlewares(
      auth,
      validBody(createExpenseRequestSchema),
    )(expensesController.createOne),
  );

  app.get(api("/expenses"), withMiddlewares(auth)(expensesController.getAll));

  app.get(
    api("/expenses/:id"),
    withMiddlewares(auth)(expensesController.getOne),
  );

  app.put(
    api("/expenses/:id"),
    withMiddlewares(
      auth,
      validBody(updateExpenseRequestSchema),
    )(expensesController.updateOne),
  );

  app.delete(
    api("/expenses/:id"),
    withMiddlewares(auth)(expensesController.deleteOne),
  );

  // ==========

  app.listen(APP_PORT, () => {
    console.log(`Started on port ${APP_PORT}`);
  });
})();

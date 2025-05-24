import express from "express";
import "dotenv/config";

import { authController } from "./app/controllers/auth.controller.js";
import { usersController } from "./app/controllers/users.controller.js";
import { auth, validBody } from "./app/middlewares.js";
import { loginRequestSchema } from "./app/requests/auth/login.request.js";
import { registerRequestSchema } from "./app/requests/auth/register.request.js";
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

  // ==========

  app.listen(APP_PORT, () => {
    console.log(`Started on port ${APP_PORT}`);
  });
})();

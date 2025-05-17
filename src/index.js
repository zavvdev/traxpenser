import express from "express";
import "dotenv/config";

import { APP_PORT } from "./infra/config.js";
import { usersHandler } from "./app/handlers/users.handler.js";

var app = express();

app.get("/users", usersHandler.getAll);

app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on port ${APP_PORT}`);
});

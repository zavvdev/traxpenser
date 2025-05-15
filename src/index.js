import express from "express";
import "dotenv/config";

import { APP_PORT } from "./infra/config.js";
import { hello } from "./app/hello.js";

var app = express();

app.get("/", hello);

app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on port ${APP_PORT}`);
});

import mongoose from "mongoose";
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "./config.js";

mongoose
  .connect(
    `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
  )
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Database connected");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Database connection error:", err);
  });

export var db = mongoose;

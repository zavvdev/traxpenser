import mongoose from "mongoose";
import {
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_REPLICA_1_PORT,
  DB_REPLICA_2_PORT,
  DB_USER,
} from "./config.js";
import { plugins } from "./plugins/index.js";

var PRIMARY_DB = `${DB_HOST}:${DB_PORT}`;
var REP_1_DB = `${DB_HOST}:${DB_REPLICA_1_PORT}`;
var REP_2_DB = `${DB_HOST}:${DB_REPLICA_2_PORT}`;

mongoose.plugin(plugins.transformInternals);
mongoose.plugin(plugins.transformDecimals);

mongoose
  .connect(
    `mongodb://${DB_USER}:${DB_PASS}@${PRIMARY_DB},${REP_1_DB},${REP_2_DB}/${DB_NAME}?authSource=admin&replicaSet=rs0`,
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

export var db = mongoose;

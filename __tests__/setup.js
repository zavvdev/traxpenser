import { afterAll, afterEach } from "vitest";
import { db } from "../src/infra/database";

afterEach(async () => {
  console.log("Dropping database...");
  await db.connection.dropDatabase();
});

afterAll(async () => {
  console.log("Disconnecting database...");
  await db.disconnect();
});

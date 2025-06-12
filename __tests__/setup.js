import { afterAll, afterEach } from "vitest";
import { beforeEach } from "vitest";
import { Category } from "../src/app/models/Category";
import { Expense } from "../src/app/models/Expense";
import { Session } from "../src/app/models/Session";
import { Settings } from "../src/app/models/Settings";
import { User } from "../src/app/models/User";
import { db } from "../src/infra/database";

var models = [Category, Expense, Session, Settings, User];

beforeEach(async () => {
  // Indexes are not created automatically after database has been dropped.
  await Promise.all(models.map((m) => m.syncIndexes()));
});

afterEach(async () => {
  await db.connection.dropDatabase();
});

afterAll(async () => {
  await db.disconnect();
});

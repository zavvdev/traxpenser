import request from "supertest";
import { describe, it } from "vitest";
import { expect } from "vitest";
import { app } from "../../src/index.js";
import { AUTH_HEADER, MESSAGES } from "../../src/infra/config.js";
import { ROUTES } from "../../src/routes.js";
import {
  assertErrorResponse,
  assertSuccessResponse,
  login,
} from "../utilities.js";

var TEST_CATEGORIES = [
  {
    name: "Category 1",
    budgetLimit: "100",
    allowOverBudget: false,
  },
  {
    name: "Category 2",
    budgetLimit: "150.99",
    allowOverBudget: true,
  },
];

var createCategories = async () => {
  var token = await login();

  await Promise.all(
    TEST_CATEGORIES.map((category) =>
      request(app)
        .post(ROUTES.categories.root())
        .send(category)
        .set(AUTH_HEADER, token),
    ),
  );
};

describe("Expenses API", () => {
  describe(`POST ${ROUTES.expenses.root()}`, () => {
    it("should create expenses", async () => {
      await createCategories();
      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "50.99",
          description: "Desc",
          isCompleted: true,
        })
        .set(AUTH_HEADER, token);

      var expenses = await request(app)
        .get(ROUTES.expenses.root())
        .set(AUTH_HEADER, token);

      expect(expenses.body.data[0].name).toEqual("Expense 1");
      expect(expenses.body.data[0].price).toEqual("50.99");
      expect(expenses.body.data[0].isCompleted).toEqual(true);
      expect(expenses.body.data[0].description).toEqual("Desc");
      expect(expenses.body.data[0].category.id).toEqual(categoryId);
    });
  });

  describe(`GET ${ROUTES.expenses.root()}`, () => {
    it("should retrieve expenses", async () => {
      await createCategories();
      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "50.99",
        })
        .set(AUTH_HEADER, token);

      var expenses = await request(app)
        .get(ROUTES.expenses.root())
        .set(AUTH_HEADER, token);

      expect(expenses.body.data[0].name).toEqual("Expense 1");
      expect(expenses.body.data[0].price).toEqual("50.99");
      expect(expenses.body.data[0].isCompleted).toEqual(false);
      expect(expenses.body.data[0].description).toEqual("");
      expect(expenses.body.data[0].category.id).toEqual(categoryId);
    });
  });

  describe(`GET ${ROUTES.expenses.one(":id")}`, () => {
    it("should retrieve one expense", async () => {
      await createCategories();
      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "50.99",
        })
        .set(AUTH_HEADER, token);

      var expenses = await request(app)
        .get(ROUTES.expenses.root())
        .set(AUTH_HEADER, token);

      var expenseId = expenses.body.data[0].id;

      var res = await request(app)
        .get(ROUTES.expenses.one(expenseId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.name).toEqual("Expense 1");
      expect(res.body.data.price).toEqual("50.99");
      expect(res.body.data.isCompleted).toEqual(false);
      expect(res.body.data.description).toEqual("");
      expect(res.body.data.category.id).toEqual(categoryId);
      expect(res.body.data.id).toEqual(expenseId);
    });

    it("should return 404 if expense is not found", async () => {
      var res = await request(app)
        .get(ROUTES.expenses.one("683ac985a16ddccfe98de69c"))
        .set(AUTH_HEADER, await login());

      assertErrorResponse(res)({
        code: 404,
        message: MESSAGES.notFound,
      });
    });
  });

  describe(`PUT ${ROUTES.expenses.one(":id")}`, () => {
    it("should update an expense", async () => {
      await createCategories();
      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "50.99",
        })
        .set(AUTH_HEADER, token);

      var expenses = await request(app)
        .get(ROUTES.expenses.root())
        .set(AUTH_HEADER, token);

      var expenseId = expenses.body.data[0].id;
      expect(expenses.body.data.length).toEqual(1);

      await request(app)
        .put(ROUTES.expenses.one(expenseId))
        .send({
          name: "Updated Expense",
          price: "60.00",
          description: "Updated Description",
          isCompleted: true,
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.expenses.one(expenseId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.name).toEqual("Updated Expense");
      expect(res.body.data.price).toEqual("60.00");
      expect(res.body.data.isCompleted).toEqual(true);
      expect(res.body.data.description).toEqual("Updated Description");
    });

    it("should return 404 if expense is not found", async () => {
      var res = await request(app)
        .put(ROUTES.expenses.one("683ac985a16ddccfe98de69c"))
        .send({
          name: "Updated Expense",
          price: "60.00",
          description: "Updated Description",
          isCompleted: true,
        })
        .set(AUTH_HEADER, await login());

      assertErrorResponse(res)({
        code: 404,
        message: MESSAGES.notFound,
      });
    });

    it("should not update an expense if category limit is exceeded", async () => {
      await createCategories();
      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "50.99",
        })
        .set(AUTH_HEADER, token);

      var expenses = await request(app)
        .get(ROUTES.expenses.root())
        .set(AUTH_HEADER, token);

      var expenseId = expenses.body.data[0].id;

      var res = await request(app)
        .put(ROUTES.expenses.one(expenseId))
        .send({
          name: "Updated Expense",
          price: "150.00",
          description: "Updated Description",
          isCompleted: true,
        })
        .set(AUTH_HEADER, token);

      assertErrorResponse(res)({
        code: 400,
        message: MESSAGES.budgetLimitExceeded,
      });
    });

    it("should update an expense if category allows over budget", async () => {
      await createCategories();
      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[1].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "50.99",
        })
        .set(AUTH_HEADER, token);

      var expenses = await request(app)
        .get(ROUTES.expenses.root())
        .set(AUTH_HEADER, token);

      var expenseId = expenses.body.data[0].id;

      await request(app)
        .put(ROUTES.expenses.one(expenseId))
        .send({
          name: "Updated Expense",
          price: "200.00",
          description: "Updated Description",
          isCompleted: true,
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.expenses.one(expenseId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.name).toEqual("Updated Expense");
      expect(res.body.data.price).toEqual("200.00");
      expect(res.body.data.isCompleted).toEqual(true);
      expect(res.body.data.description).toEqual("Updated Description");
    });
  });

  describe(`DELETE ${ROUTES.expenses.one(":id")}`, () => {
    it("should delete an expense", async () => {
      await createCategories();
      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "50.99",
        })
        .set(AUTH_HEADER, token);

      var expenses = await request(app)
        .get(ROUTES.expenses.root())
        .set(AUTH_HEADER, token);

      var expenseId = expenses.body.data[0].id;

      expect(expenses.body.data.length).toEqual(1);

      var res = await request(app)
        .delete(ROUTES.expenses.one(expenseId))
        .set(AUTH_HEADER, token);

      assertSuccessResponse(res)();

      expenses = await request(app)
        .get(ROUTES.expenses.root())
        .set(AUTH_HEADER, token);

      expect(expenses.body.data.length).toEqual(0);
    });

    it("should return 404 if expense is not found", async () => {
      var res = await request(app)
        .delete(ROUTES.expenses.one("683ac985a16ddccfe98de69c"))
        .set(AUTH_HEADER, await login());

      assertErrorResponse(res)({
        code: 404,
        message: MESSAGES.notFound,
      });
    });
  });

  describe(`GET ${ROUTES.expenses.totalPrice()}`, () => {
    it("should return total price of expenses", async () => {
      await createCategories();
      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "50.99",
        })
        .set(AUTH_HEADER, token);

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 2",
          price: "30.00",
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.expenses.totalPrice())
        .set(AUTH_HEADER, token);

      expect(res.body.data).toEqual("80.99");
    });
  });
});

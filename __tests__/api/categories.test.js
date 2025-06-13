import request from "supertest";
import { describe, it } from "vitest";
import { expect } from "vitest";
import { app } from "../../src/index.js";
import {
  AUTH_HEADER,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "../../src/infra/config.js";
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
  {
    name: "Category 3",
    budgetLimit: "50",
  },
  {
    name: "Category 4",
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

describe("Categories API", () => {
  describe(`POST ${ROUTES.categories.root()}`, () => {
    it("should create categories", async () => {
      await createCategories();

      var res = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, await login());

      expect(res.body.data[0].name).toEqual(TEST_CATEGORIES[0].name);
      expect(res.body.data[0].budgetLimit).toEqual(
        TEST_CATEGORIES[0].budgetLimit,
      );
      expect(res.body.data[0].allowOverBudget).toEqual(
        TEST_CATEGORIES[0].allowOverBudget,
      );

      expect(res.body.data[1].name).toEqual(TEST_CATEGORIES[1].name);
      expect(res.body.data[1].budgetLimit).toEqual(
        TEST_CATEGORIES[1].budgetLimit,
      );
      expect(res.body.data[1].allowOverBudget).toEqual(
        TEST_CATEGORIES[1].allowOverBudget,
      );

      expect(res.body.data[2].name).toEqual(TEST_CATEGORIES[2].name);
      expect(res.body.data[2].budgetLimit).toEqual(
        TEST_CATEGORIES[2].budgetLimit,
      );
      expect(res.body.data[2].allowOverBudget).toEqual(false);

      expect(res.body.data[3].name).toEqual(TEST_CATEGORIES[3].name);
      expect(res.body.data[3].budgetLimit).toEqual(null);
      expect(res.body.data[3].allowOverBudget).toEqual(false);
    });

    it("should create category with large budget", async () => {
      var token = await login();

      var res = await request(app)
        .post(ROUTES.categories.root())
        .send({
          name: "Large Budget Category",
          budgetLimit: "9000000000000000000000000000123.456",
        })
        .set(AUTH_HEADER, token);

      expect(res.body.data.name).toEqual("Large Budget Category");
      expect(res.body.data.budgetLimit).toEqual(
        "9000000000000000000000000000123.456",
      );
      expect(res.body.data.allowOverBudget).toEqual(false);
    });

    it("should not create category if budget is too large", async () => {
      var token = await login();

      var res = await request(app)
        .post(ROUTES.categories.root())
        .send({
          name: "Large Budget Category",
          budgetLimit: "900000000000000000000000000012345678",
        })
        .set(AUTH_HEADER, token);

      assertErrorResponse(res)({
        code: 400,
        message: MESSAGES.validationError,
        data: {
          budgetLimit: VALIDATION_MESSAGES.invalid,
        },
      });
    });
  });

  describe(`GET ${ROUTES.categories.root()}`, () => {
    it("should get categories", async () => {
      await createCategories();

      var res = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, await login());

      expect(res.body.data[0].name).toEqual(TEST_CATEGORIES[0].name);
      expect(res.body.data[0].budgetLimit).toEqual(
        TEST_CATEGORIES[0].budgetLimit,
      );
      expect(res.body.data[0].allowOverBudget).toEqual(
        TEST_CATEGORIES[0].allowOverBudget,
      );

      expect(res.body.data[1].name).toEqual(TEST_CATEGORIES[1].name);
      expect(res.body.data[1].budgetLimit).toEqual(
        TEST_CATEGORIES[1].budgetLimit,
      );
      expect(res.body.data[1].allowOverBudget).toEqual(
        TEST_CATEGORIES[1].allowOverBudget,
      );
    });
  });

  describe(`GET ${ROUTES.categories.one(":id")}`, async () => {
    it("should get a category by ID", async () => {
      await createCategories();

      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.categories.one(categories.body.data[0].id))
        .set(AUTH_HEADER, token);

      expect(res.body.data.name).toEqual(TEST_CATEGORIES[0].name);
      expect(res.body.data.budgetLimit).toEqual(TEST_CATEGORIES[0].budgetLimit);
      expect(res.body.data.allowOverBudget).toEqual(
        TEST_CATEGORIES[0].allowOverBudget,
      );
    });

    it("should return 404 for non-existing category", async () => {
      var res = await request(app)
        .get(ROUTES.categories.one("684bfe94d9e9be352d33a8ad"))
        .set(AUTH_HEADER, await login());

      assertErrorResponse(res)({
        code: 404,
        message: MESSAGES.notFound,
      });
    });
  });

  describe(`PUT ${ROUTES.categories.one(":id")}`, async () => {
    it("should update a category", async () => {
      await createCategories();

      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .put(ROUTES.categories.one(categoryId))
        .send({
          name: "Updated Category",
          budgetLimit: "200",
          allowOverBudget: true,
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.categories.one(categoryId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.name).toEqual("Updated Category");
      expect(res.body.data.budgetLimit).toEqual("200");
      expect(res.body.data.allowOverBudget).toEqual(true);
    });

    it("should not update a category if budget limit is exceeded", async () => {
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
          price: "90.99",
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .put(ROUTES.categories.one(categoryId))
        .send({
          name: "Updated Category",
          budgetLimit: "50",
        })
        .set(AUTH_HEADER, token);

      assertErrorResponse(res)({
        code: 400,
        message: MESSAGES.budgetLimitExceeded,
      });
    });

    it("should update a category with if allowOverBudget=true", async () => {
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
          price: "150",
        })
        .set(AUTH_HEADER, token);

      await request(app)
        .put(ROUTES.categories.one(categoryId))
        .send({
          name: "Updated Category",
          budgetLimit: "50",
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.categories.one(categoryId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.name).toEqual("Updated Category");
      expect(res.body.data.budgetLimit).toEqual("50");
      expect(res.body.data.allowOverBudget).toEqual(true);
    });

    it("should update a category with if budgetLimit=null", async () => {
      var token = await login();

      await request(app)
        .post(ROUTES.categories.root())
        .send({
          name: "Category 1",
          allowOverBudget: false,
        })
        .set(AUTH_HEADER, token);

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      await request(app)
        .post(ROUTES.expenses.root())
        .send({
          categoryId,
          name: "Expense 1",
          price: "150",
        })
        .set(AUTH_HEADER, token);

      await request(app)
        .put(ROUTES.categories.one(categoryId))
        .send({
          name: "Updated Category",
          budgetLimit: "5000",
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.categories.one(categoryId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.name).toEqual("Updated Category");
      expect(res.body.data.budgetLimit).toEqual("5000");
      expect(res.body.data.allowOverBudget).toEqual(false);
    });
  });

  describe(`DELETE ${ROUTES.categories.one("id")}`, async () => {
    it("should delete a category", async () => {
      await createCategories();

      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      var res = await request(app)
        .delete(ROUTES.categories.one(categoryId))
        .set(AUTH_HEADER, token);

      assertSuccessResponse(res)();

      var res2 = await request(app)
        .get(ROUTES.categories.one(categoryId))
        .set(AUTH_HEADER, token);

      assertErrorResponse(res2)({
        code: 404,
        message: MESSAGES.notFound,
      });
    });

    it("should not delete a non-existing category", async () => {
      var res = await request(app)
        .delete(ROUTES.categories.one("684bfe94d9e9be352d33a8ad"))
        .set(AUTH_HEADER, await login());

      assertErrorResponse(res)({
        code: 404,
        message: MESSAGES.notFound,
      });
    });
  });

  describe(`GET ${ROUTES.categories.availableBudget(":id")}`, async () => {
    it("should get available budget for an empty category", async () => {
      await createCategories();

      var token = await login();

      var categories = await request(app)
        .get(ROUTES.categories.root())
        .set(AUTH_HEADER, token);

      var categoryId = categories.body.data[0].id;

      var res = await request(app)
        .get(ROUTES.categories.availableBudget(categoryId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.availableBudget).toEqual(
        TEST_CATEGORIES[0].budgetLimit,
      );
      expect(res.body.data.isLimitless).toEqual(false);
    });

    it("should get available budget for category with expenses", async () => {
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
          price: "50",
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.categories.availableBudget(categoryId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.availableBudget).toEqual("50");
    });

    it("should get available budget for category with limitless budget", async () => {
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
          price: "350",
        })
        .set(AUTH_HEADER, token);

      var res = await request(app)
        .get(ROUTES.categories.availableBudget(categoryId))
        .set(AUTH_HEADER, token);

      expect(res.body.data.availableBudget).toEqual("-199.01");
    });
  });
});

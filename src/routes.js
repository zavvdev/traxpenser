var v1 = (path) => `/api/v1${path}`;

export var ROUTES = {
  auth: {
    register: () => v1("/auth/register"),
    login: () => v1("/auth/login"),
    logout: () => v1("/auth/logout"),
  },
  users: {
    me: () => v1("/me"),
  },
  settings: {
    root: () => v1("/settings"),
  },
  categories: {
    root: () => v1("/categories"),
    one: (id) => v1(`/categories/${id}`),
    availableBudget: (id) => v1(`/categories/${id}/available-budget`),
  },
  expenses: {
    root: () => v1("/expenses"),
    one: (id) => v1(`/expenses/${id}`),
    totalPrice: () => v1("/expenses/total-price"),
  },
};

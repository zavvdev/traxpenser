import { db } from "../database/index.js";

export class UsersRepo {
  constructor(client) {
    /**
     * @type {import("mongoose")}
     */
    this._client = client;
  }

  async getAll() {
    return this._client.get();
  }
}

export var usersRepo = new UsersRepo(db);

import { db } from "../database/index.js";
import { User } from "../models/User.js";

export class UsersRepo {
  constructor(client) {
    /**
     * @type {import("mongoose")}
     */
    this._client = client;
  }

  async getAll() {
    return await User.find();
  }
}

export var usersRepo = new UsersRepo(db);

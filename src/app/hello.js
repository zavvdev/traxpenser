import { usersRepo } from "../infra/repositories/users.repository.js";

export function hello(_, res) {
  res.send(usersRepo.getAll());
}

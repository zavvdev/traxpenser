import { catchError, from, map, of } from "rxjs";
import { usersRepo } from "../../infra/repositories/users.repository.js";
import { errorResponse, handler, successResponse } from "../utilities.js";

var getAll = handler(async (_, res) =>
  from(usersRepo.getAll()).pipe(
    map(successResponse(res)),
    catchError(() => of(errorResponse(res)())),
  ),
);

export var usersHandler = {
  getAll,
};

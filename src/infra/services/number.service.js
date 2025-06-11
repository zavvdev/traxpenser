import Decimal from "decimal.js";
import { PRICE_PRECISION } from "../config.js";

class NumberService {
  constructor() {
    Decimal.set({ precision: PRICE_PRECISION });
  }

  minus(x, y) {
    return new Decimal(x).minus(new Decimal(y)).toFixed();
  }

  sum(x, y) {
    return new Decimal(x).add(new Decimal(y)).toFixed();
  }

  lte(x, y) {
    return new Decimal(x).lessThanOrEqualTo(y);
  }
}

export var numberService = new NumberService();

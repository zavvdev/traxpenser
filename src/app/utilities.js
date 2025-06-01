/**
 * @param {string?} min
 * @param {string?} max
 */
export var getPeriodRangeSelector = (min, max) => {
  var endOfDay = (dateStr) => {
    var d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d;
  };

  return {
    $gte: min ? new Date(min) : new Date(0),
    $lte: max ? endOfDay(max) : new Date(),
  };
};

export var extractSchemaValidationError = (e) =>
  e.path && e.message
    ? {
        [e.path]: e.message,
      }
    : null;

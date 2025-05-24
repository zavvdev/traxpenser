export function cleanTransform(schema) {
  var transform = (_, value) => {
    value.id = value._id;
    delete value._id;
    delete value.__v;
    return value;
  };

  schema.set("toJSON", {
    virtuals: true,
    transform,
  });

  schema.set("toObject", {
    virtuals: true,
    transform,
  });
}

export var transformPlugin = (transformer) => (schema) => {
  var prevToJson = schema.get("toJSON")?.transform;
  var prevToObject = schema.get("toObject")?.transform;

  schema.set("toJSON", {
    virtuals: true,
    transform: (doc, value) => {
      if (prevToJson) {
        value = prevToJson(doc, value);
      }
      return transformer(doc, value);
    },
  });

  schema.set("toObject", {
    virtuals: true,
    transform: (doc, value) => {
      if (prevToObject) {
        value = prevToObject(doc, value);
      }
      return transformer(doc, value);
    },
  });
};

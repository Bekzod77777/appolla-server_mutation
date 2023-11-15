import fs from "fs";
import path from "path";
import resolvers from "./book.resolver.js";

const schema = fs.readFileSync(
  path.resolve("src", "modules", "book", "book.schema.gql"),
  "utf-8"
);

export default {
  resolvers,
  typeDefs: schema,
};

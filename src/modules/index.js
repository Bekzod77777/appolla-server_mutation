import { makeExecutableSchema } from "@graphql-tools/schema";
import User from "./user/index.js";
import Book from "./book/index.js";

export default makeExecutableSchema({
  typeDefs: [User.typeDefs],
  resolvers: [User.resolvers],
  typeDefs: [Book.typeDefs],
  resolvers: [Book.resolvers],
});

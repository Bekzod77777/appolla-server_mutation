import { GraphQLError } from "graphql";
import { Book } from "./models/book.model.js";

export default {
  Query: {
    book: async (parent, { id }, context) => {
      const book = await Book.findOne({ where: { id: id } });
      if (!book) {
        throw new GraphQLError("book is not found", {
          extensions: {
            code: "NOT_FOUND",
            http: {
              code: 404,
            },
          },
        });
      }
      return book;
    },

    books: async () => {
      try {
        const books = await Book.findAll();
        return books;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: {
              code: 500,
            },
          },
        });
      }
    },
  },

  Mutation: {
    book: async (_, { title, author }) => {
      try {
        const book = await Book.create({
          title,
          author,
        });

        return book;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: {
              code: 500,
            },
          },
        });
      }
    },

    updateBook: async (_, { id, dto }) => {
      try {
        const book = await Book.findOne({ where: { id } });

        if (!book) {
          throw new GraphQLError("book is not found", {
            extensions: {
              code: "NOT_FOUND",
              http: {
                code: 404,
              },
            },
          });
        }

        book.title = dto.title ?? book.title;
        book.author = dto.author ?? book.author;

        await book.save();

        return book;
      } catch (error) {
        if (error.message == "book is not found") {
          throw error;
        }
        throw new GraphQLError(error.message, {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: {
              code: 500,
            },
          },
        });
      }
    },

    deleteBook: async (_, { id }) => {
      try {
        const book = await Book.findOne({ where: { id } });

        if (!book) {
          throw new GraphQLError("book is not found", {
            extensions: {
              code: "NOT_FOUND",
              http: {
                code: 404,
              },
            },
          });
        }

        await book.destroy();

        return book;
      } catch (error) {
        if (error.message == "book is not found") {
          throw error;
        }
        throw new GraphQLError(error.message, {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: {
              code: 500,
            },
          },
        });
      }
    },
  },
};

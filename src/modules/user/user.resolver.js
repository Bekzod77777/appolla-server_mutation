import { GraphQLError } from "graphql";
import { User } from "./models/user.model.js";

export default {
  Query: {
    user: async (parent, { id }, context) => {
      const user = await User.findOne({ where: { id: id } });
      if (!user) {
        throw new GraphQLError("user is not found", {
          extensions: {
            code: "NOT_FOUND",
            http: {
              code: 404,
            },
          },
        });
      }
      return user;
    },

    users: async () => {
      try {
        const users = await User.findAll();
        return users;
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
    user: async (_, { username, password }) => {
      try {
        const user = await User.create({
          username,
          password,
        });

        return user;
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

    updateUser: async (_, { id, dto }) => {
      try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
          throw new GraphQLError("user is not found", {
            extensions: {
              code: "NOT_FOUND",
              http: {
                code: 404,
              },
            },
          });
        }

        user.username = dto.username ?? user.username;
        user.password = dto.password ?? user.password;

        await user.save();

        return user;
      } catch (error) {
        if (error.message == "user is not found") {
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

    deleteUser: async (_, { id }) => {
      try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
          throw new GraphQLError("user is not found", {
            extensions: {
              code: "NOT_FOUND",
              http: {
                code: 404,
              },
            },
          });
        }

        await user.destroy();

        return user;
      } catch (error) {
        if (error.message == "user is not found") {
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

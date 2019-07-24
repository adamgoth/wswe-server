const { ApolloServer, gql } = require("apollo-server");
import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import { Recipe } from "./entity/Recipe";

const typeDefs = gql`
  type Recipe {
    title: String
    link: String
  }

  input RecipeInput {
    title: String
    link: String
  }

  type Query {
    recipes: [Recipe]
  }

  type Mutation {
    newRecipe(input: RecipeInput!): Recipe!
  }
`;

const resolvers = {
  Query: {
    recipes: async () => {
      try {
        const recipes = await getConnection().manager.find(Recipe);
        return recipes;
      } catch (error) {
        console.log(error);
      }
    }
  },
  Mutation: {
    newRecipe: async (_, args) => {
      try {
        const { input } = args;
        const recipe = new Recipe();
        recipe.title = input.title;
        recipe.link = input.link;
        const savedRecipe = await getConnection().manager.save(recipe);
        return savedRecipe;
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

createConnection()
  .then(connection => console.log("connected to db"))
  .catch(error => console.log(error));

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

const { ApolloServer, gql } = require("apollo-server");
import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";
import { Recipe } from "./entity/Recipe";

const typeDefs = gql`
  type Recipe {
    title: String
    link: String
  }

  type Query {
    recipes: [Recipe]
  }
`;

const resolvers = {
  Query: {
    recipes: async () => {
      try {
        // const connection = await createConnection();
        const recipes = await getConnection().manager.find(Recipe);
        return recipes;
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

// createConnection()
//   .then(async connection => {
//     console.log("connected to database");

// const recipe = new Recipe();
// recipe.title = "test recipe";
// recipe.link = "www.google.com";

// await connection.manager.save(recipe);
// console.log("Saved a new recipe with id: " + recipe.id);

// console.log("Loading recipes from the database...");
// const recipes = await connection.manager.find(Recipe);
// console.log("Loaded recipes: ", recipes);

//   console.log("Here you can setup and run express/koa/any other framework.");
// })
// .catch(error => console.log(error));

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

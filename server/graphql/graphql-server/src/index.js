const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
require("../models/setups");

const app = express();

const startServer = async () => {
  await mongoose.connect("mongodb://mongo:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();

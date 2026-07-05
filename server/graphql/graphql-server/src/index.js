require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
require("../models/setups");

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const startServer = async () => {
  await mongoose.connect(MONGO_URI);

  app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.listen({ port: PORT }, () =>
    console.log(`Serveur GraphQL prêt sur http://localhost:${PORT}${server.graphqlPath}`)
  );
};

startServer().catch((err) => {
  console.error("Échec du démarrage du serveur :", err);
  process.exit(1);
});

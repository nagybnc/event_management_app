import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { EventResolver } from "./resolvers/EventResolver";
import { ParticipantResolver } from "./resolvers/ParticipantResolver";

async function main() {
  await AppDataSource.initialize();
  console.log("Database connected");

  const schema = await buildSchema({
    resolvers: [EventResolver, ParticipantResolver],
    validate: false,
  });

  const server = new ApolloServer({ schema });
  await server.start();

  const app = express();
  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  app.listen(4000, () => {
    console.log("Server running at http://localhost:4000/graphql");
  });
}

main().catch(console.error);

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import gql from "graphql-tag";
import { AppDataSource } from "./data-source";
import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import cors from "cors";
import { resolvers } from "./resolvers";
import router from "./routes";
import { updateStatus } from "./utils/users-time";

interface MyContext {
  token?: String;
}
AppDataSource.initialize()
  .then((): void => console.log("connected"))
  .catch((err: unknown): void => console.log(err));
async function startServer() {
  const schema = fs.readFileSync(
    path.resolve(process.cwd(), "src", "graphql", "schema.gql")
  );

  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<MyContext>({
    typeDefs: gql`
      ${schema}
    `,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(express.json());
  app.use(router);
  app.use("/static", express.static(path.join(process.cwd(), "uploads")));
  setInterval(() => {
    updateStatus();
  },5000);
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});

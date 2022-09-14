const {ApolloServer,gql} = require('apollo-server-express')
const {ApolloServerPluginDrainHttpServer} = require('apollo-server-core')
const express = require('express')
const http = require('http')

const typeDefs = gql`
    type Query {
        hello: String
    }
`

const resolvers = {
    Query: {
        hello: () => 'Hello world!'
    }
}

async function startApolloServer(typeDefs, resolvers) {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise(resolve => httpServer.listen({ port: 5000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}

exports.default = startApolloServer(typeDefs,resolvers);
'use strict';

const fs = require('fs');
const path = require('path');
const fastify = require('fastify')({
  logger: {
    prettyPrint: require('pino-pretty'),
  },
});
const { ApolloServer, gql } = require('1-server-fastify');

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'graphql', 'schema.gql'),
  'utf8'
);
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  await server.start();
  fastify.register(server.createHandler());
  fastify.listen(3000);

  await fastify.listen(3000);
})();

"use strict";

const pino = require("pino");
const { grpc } = require("@mntd/proto_loader");
const { GameService, services } = require("@mntd/game_service");

const port = process.env.GRPC_PORT ?? 5000;
const logger = pino({
  prettyPrint: require("pino-pretty"),
});
const server = new grpc.Server();

server.addService(GameService.service, services);

server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    server.start();
    logger.info(`gRPC Server running on port ${port}`);
  }
);

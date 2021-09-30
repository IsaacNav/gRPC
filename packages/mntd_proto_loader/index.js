"use strict";

const path = require("path");
const protoloader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");

const packageDefinitions = protoloader.loadSync(
  path.join(__dirname, "schema", "Services.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    arrays: true,
  }
);

const packageObj = grpc.loadPackageDefinition(packageDefinitions);
const { GameService } = packageObj;

module.exports = { GameService, grpc };

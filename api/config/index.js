"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionString = exports.persistencePath = exports.persistenceType = exports.serverPort = void 0;
require("dotenv/config");
// Server configuration
const serverPort = process.env.SERVER_PORT || 4000;
exports.serverPort = serverPort;
// Analysis persistence configuration
const persistenceType = process.env.PERSISTENCE_TYPE || "mongo";
exports.persistenceType = persistenceType;
const persistencePath = process.env.PERSISTENCE_PATH || "src/data/analysisOutputs.json";
exports.persistencePath = persistencePath;
// Database configuration
const connectionString = process.env.ATLAS_URI || "";
exports.connectionString = connectionString;

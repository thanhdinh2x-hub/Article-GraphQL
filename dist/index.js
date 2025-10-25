"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const server_1 = require("@apollo/server");
const express5_1 = require("@as-integrations/express5");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const index_typeDefs_1 = require("./typeDefs/index.typeDefs");
const index_resolver_1 = require("./resolvers/index.resolver");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    (0, database_1.connect)();
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const port = process.env.PORT;
    app.use("/graphql", auth_middleware_1.requireAuth);
    const apolloServer = new server_1.ApolloServer({
        typeDefs: index_typeDefs_1.typeDefs,
        resolvers: index_resolver_1.resolvers,
        introspection: true,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    yield apolloServer.start();
    app.use('/graphql', (0, cors_1.default)(), express_1.default.json(), (0, express5_1.expressMiddleware)(apolloServer, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) { return (Object.assign({}, req)); })
    }));
    yield new Promise((resolve) => {
        httpServer.listen({ port: port }, () => resolve());
    });
    console.log(`🚀 Server ready at http://localhost:${port}`);
});
startServer();

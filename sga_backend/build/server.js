"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const visitorRouter_1 = __importDefault(require("./router/visitorRouter"));
const visitRouter_1 = __importDefault(require("./router/visitRouter"));
const client_1 = __importDefault(require("./prisma/client"));
const fastify = (0, fastify_1.default)({
    logger: true,
});
// Inject Prisma into Fastify instance
fastify.decorate("prisma", client_1.default);
const port = Number(process.env.HTTP_PORT) || 4000;
const start = async () => {
    try {
        // Register CORS
        await fastify.register(cors_1.default, {
            origin: ["http://localhost:3000", "http://192.168.0.108:3000"],
        });
        // Register form-body for urlencoded parsing
        await fastify.register(formbody_1.default);
        // Register your routers
        fastify.register(visitorRouter_1.default, { prefix: "/api/visitor" });
        fastify.register(visitRouter_1.default, { prefix: "/api/visit" });
        // Root route
        fastify.get("/", async (request, reply) => {
            return { message: "🚀 API ready to serve! 🚀" };
        });
        await fastify.listen({ port, host: "0.0.0.0" });
        fastify.log.info(`🚀 API listening at http://localhost:${port} 🚀`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();

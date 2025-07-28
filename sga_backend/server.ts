// server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import visitorRouter from "./router/visitorRouter";
import visitRouter from "./router/visitRouter";
import prisma from "./prisma/client";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  },
});

// Inject Prisma into Fastify instance
fastify.decorate("prisma", prisma);

const apiPort = Number(process.env.API_PORT) || 4000;
const frontendPort = Number(process.env.FRONTEND_PORT) || 3000;

const start = async () => {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: [
        `http://localhost:${frontendPort}`,
        `http://192.168.0.108:${frontendPort}`,
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });

    // Register form-body for urlencoded parsing
    await fastify.register(formbody);

    // Register your routers
    fastify.register(visitorRouter, { prefix: "/api/visitor" });
    fastify.register(visitRouter, { prefix: "/api/visit" });

    // Root route
    fastify.get("/", async (request, reply) => {
      return { message: "🚀 API ready to serve! 🚀" };
    });

    await fastify.listen({ port: apiPort, host: "0.0.0.0" });
    fastify.log.info(`🚀 API listening at http://localhost:${apiPort} 🚀`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

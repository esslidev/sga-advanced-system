import { FastifyInstance } from "fastify";
import authController from "./auth.controller";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/sign-up", authController.signUp);
  fastify.post("/sign-in", authController.signIn);
  fastify.post("/sign-out", authController.signOut);
  fastify.post("/access/renew", authController.renewAccess);
}

export default authRoutes;

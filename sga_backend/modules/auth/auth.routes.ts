import { FastifyInstance } from "fastify";
import authController from "./auth.controller";
import { authHook } from "../../hooks/authHook";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/sign-up", authController.signUp);
  fastify.post("/sign-in", authController.signIn);
  fastify.post("/sign-out", { preHandler: authHook }, authController.signOut);
  fastify.post("/access/renew", authController.renewAccess);
}

export default authRoutes;

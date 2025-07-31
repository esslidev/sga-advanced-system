import { FastifyInstance } from "fastify";
import {
  authMiddleware,
  integrationAuthMiddleware,
} from "../middlewares/authMidleware";
import * as authController from "../controllers/authController";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/sign_in",
    { preHandler: integrationAuthMiddleware },
    authController.signIn
  );
  fastify.post(
    "/sign_out",
    { preHandler: authMiddleware },
    authController.signOut
  );
  fastify.post(
    "/access/renew",
    { preHandler: integrationAuthMiddleware },
    authController.renewAccess
  );
}

export default authRoutes;

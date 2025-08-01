import { FastifyInstance } from "fastify";
import {
  authHook,
  integrationAuthHook,
} from "../hooks/authHook";
import * as authController from "../controllers/authController";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/sign-up",
    authController.signUp
  );
  fastify.post(
    "/sign-in",
    // { preHandler: integrationAuthHook },
    authController.signIn
  );
  fastify.post(
    "/sign-out",
    { preHandler: authHook },
    authController.signOut
  );
  fastify.post(
    "/access/renew",
    { preHandler: integrationAuthHook },
    authController.renewAccess
  );
}

export default authRoutes;

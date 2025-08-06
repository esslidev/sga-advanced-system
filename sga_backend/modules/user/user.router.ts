// user.router.ts
import { FastifyInstance } from "fastify";
import userController from "./user.controller";
import { authHook, isAdminHook } from "../../hooks/authHook";

export default async function userRouter(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authHook);
  fastify.get("/get-user", userController.getUser);
  fastify.get(
    "/get-users",
    { preHandler: isAdminHook },
    userController.getUsers
  );
  fastify.delete(
    "/delete-user",
    { preHandler: isAdminHook },
    userController.deleteUser
  );
}

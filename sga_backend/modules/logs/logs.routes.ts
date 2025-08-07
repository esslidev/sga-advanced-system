import { FastifyInstance } from "fastify";
import logsController from "./logs.controller";
import { authHook, isAdminHook } from "../../hooks/authHook";

export default async function logsRouter(fastify: FastifyInstance) {
  fastify.get(
    "/get-logs",
    { preHandler: [authHook, isAdminHook] },
    logsController.getLogs
  );
}

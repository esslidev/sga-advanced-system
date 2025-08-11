import { FastifyInstance } from "fastify";
import visitorController from "./visitor.controller";
import { authHook } from "../../hooks/authHook";

export default async function visitorRouter(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authHook);
  fastify.get("/get-visitor", visitorController.getVisitor);
  fastify.get("/get-visitors", visitorController.getVisitors);
  fastify.post("/add-visitor", visitorController.addVisitor);
  fastify.put("/update-visitor", visitorController.updateVisitor);
  fastify.delete("/delete-visitor", visitorController.deleteVisitor);
}

import { FastifyInstance } from "fastify";
import visitorController from "../controllers/visitorController";

export default async function visitorRouter(fastify: FastifyInstance) {
  fastify.get("/get-visitor", visitorController.getVisitor);
  fastify.get("/get-visitors", visitorController.getVisitors);
  fastify.post("/add-visitor", visitorController.addVisitor);
  fastify.put("/update-visitor", visitorController.updateVisitor);
  fastify.delete("/delete-visitor", visitorController.deleteVisitor);
}

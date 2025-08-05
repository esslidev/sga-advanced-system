import { FastifyInstance } from "fastify";
import visitController from "./visit.controller";

export default async function visitRouter(fastify: FastifyInstance) {
  fastify.get("/get-visits", visitController.getVisits);
  fastify.post("/add-visit", visitController.addVisit);
  fastify.put("/update-visit", visitController.updateVisit);
  fastify.delete("/delete-visit", visitController.deleteVisit);
}

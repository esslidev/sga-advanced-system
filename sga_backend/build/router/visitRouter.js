"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = visitRouter;
const visitController_1 = __importDefault(require("../controllers/visitController"));
async function visitRouter(fastify) {
    fastify.get("/get-visits", visitController_1.default.getVisits);
    fastify.post("/add-visit", visitController_1.default.addVisit);
    fastify.put("/update-visit", visitController_1.default.updateVisit);
    fastify.delete("/delete-visit", visitController_1.default.deleteVisit);
}

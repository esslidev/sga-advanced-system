"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = visitorRouter;
const visitorController_1 = __importDefault(require("../controllers/visitorController"));
async function visitorRouter(fastify) {
    fastify.get("/get-visitor", visitorController_1.default.getVisitor);
    fastify.get("/get-visitors", visitorController_1.default.getVisitors);
    fastify.post("/add-visitor", visitorController_1.default.addVisitor);
    fastify.put("/update-visitor", visitorController_1.default.updateVisitor);
    fastify.delete("/delete-visitor", visitorController_1.default.deleteVisitor);
}

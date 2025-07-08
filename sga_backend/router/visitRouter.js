import express from "express";

import visitController from "../controllers/visitController.js";

const visitRouter = express.Router();

// Define the routes
visitRouter.get("/get-visits", visitController.getVisits); // needs an admin middleware
// visitRouter.post("/add-visit", visitController.addVisit);
// visitRouter.put("/update-visit", visitController.updateVisit);
// visitRouter.delete("/delete-visit", visitController.deleteVisit);

export default visitRouter;

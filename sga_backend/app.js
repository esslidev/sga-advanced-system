import express from "express";
import { createServer } from "http";
import cors from "cors";
import visitorRouter from "./router/visitorRouter.js";
import visitRouter from "./router/visitRouter.js";

const port = 4000;

const app = express();
console.log(process.env.HTTP_PORT);

const corOptions = {
  origin: ["http://localhost:3000"],
};

const httpServer = createServer(app);

app.use(cors(corOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/visitor", visitorRouter);
app.use("/api/visit", visitRouter);

app.get("/", async (req, res, next) => {
  res.send({ message: "🚀 API ready to serve! 🚀" });
});

httpServer.listen(port, () =>
  console.log(`🚀 API istening at http://localhost:${port} 🚀`)
);

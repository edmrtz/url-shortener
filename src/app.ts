import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { router as links } from "./routes/links.routes";

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(links);

app.get("/health", (_req, res) => res.json({ ok: true }));
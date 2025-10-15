import { Router } from 'express';
import { createLink, deleteLink, getLink, redirect, stats } from '../controllers/links.controller';
import { rateLimit } from '../middlewares/rateLimit';

export const router = Router();

router.post("/api/links", rateLimit, createLink);
router.get("/api/links/:id", getLink);
router.get("/api/links/:id/stats", stats);
router.delete("/api/links/:id", deleteLink);
router.get("/:code", redirect);
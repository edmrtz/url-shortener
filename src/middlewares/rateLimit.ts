import type { Request, Response, NextFunction } from "express";

const store = new Map<string, { hits: number; reset: number }>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
    const windowMs = Number(process.env.RATE_LIMIT_WINDODWS_MS || 60000);
    const max = Number(process.env.RATE_LIMIT_MAX || 60);
    const key = req.ip || "global";

    const now = Date.now();
    const bucket = store.get(key) || { hits: 0, reset: now + windowMs };
    if (now > bucket.reset) {
        bucket.hits = 0;
        bucket.reset = now + windowMs;
    }

    bucket.hits++;
    store.set(key, bucket);

    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - bucket.hits).toString());
    res.setHeader("X-RateLimit-Reset", Math.floor(bucket.reset / 1000).toString());
    if (bucket.hits > max) return res.status(429).json({ error: "Too many requests" });
    next();
}
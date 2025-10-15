import { prisma } from "../lib/prisma";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import { parselSOorNull } from "../utils/dates";
import type { Request, Response } from "express";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 7);

const createLinkSchema = z.object({
    url: z.string().url(),
    expiresAt: z.string().datetime().optional()
});

export async function createLink(req: Request, res: Response) {
    const parse = createLinkSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const { url, expiresAt } = parse.data;
    const shortCode = nanoid();
    const link = await prisma.link.create({
        data: {
            originalUrl: url,
            shortCode,
            expiresAt: parselSOorNull(expiresAt || undefined) ?? undefined
        }
    });
    res.status(201).json({
        id: link.id,
        shortCode: link.shortCode,
        shortUrl: `${process.env.BASE_URL}/${link.shortCode}`
    });
}

export async function getLink(req: Request, res: Response) {
    const id = Number(req.params.id);
    const link = await prisma.link.findUnique({
        where: { id },
        include: {
            _count: { select: { clicks: true } }
        }
    });
    if (!link) return res.status(404).json({ error: "Not found" });
    res.json(link);
}

export async function deleteLink(req: Request, res: Response) {
    const id = Number(req.params.id);
    await prisma.click.deleteMany({ where: { linkId: id } });
    await prisma.link.delete({ where: { id } }).catch(() => null);
    res.status(204).send();
}

export async function redirect(req: Request, res: Response) {
    const { code } = req.params;
    const link = await prisma.link.findUnique({
        where: { shortCode: code }
    });
    if (!link) return res.status(404).send("Not found");
    if (link.expiresAt && link.expiresAt < new Date()) return res.status(410).send("Link expired");
    await prisma.click.create({
        data: {
            linkId: link.id,
            ip: req.ip,
            userAgent: req.get("user-agent") || null,
            referrer: req.get("referrer") || null
        }
    });
    res.redirect(link.originalUrl);
}

export async function stats(req: Request, res: Response) {
    const id = Number(req.params.id);
    const from = parselSOorNull(req.query.from as string | undefined);
    const to = parselSOorNull(req.query.to as string | undefined);
    const where: any = { linkId: id };
    if (from || to) where.createdAt = { gte: from ?? undefined, lte: to ?? undefined };

    const [byDay, byRef, byUA, total] = await Promise.all([
        prisma.click.groupBy({ by: ["createdAt"], where, _count: { _all: true } }).then(rows => rows.map(r => ({ date: r.createdAt.toISOString().slice(0, 10), count: r._count._all }))),
        prisma.click.groupBy({ by: ["referrer"], where, _count: { _all: true } }).then(rows => rows.map(r => ({ referrer: r.referrer ?? "unknown", count: r._count._all }))),
        prisma.click.groupBy({ by: ["userAgent"], where, _count: { _all: true } }).then(rows => rows.map(r => ({ userAgent: r.userAgent ?? "unknown", count: r._count._all }))),
        prisma.click.count({ where })
    ]);

    res.json({ total, byDay, byReferrer: byRef, byUserAgent: byUA });
}
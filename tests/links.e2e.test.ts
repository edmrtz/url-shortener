import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

beforeAll(async () => {
    await prisma.$executeRawUnsafe("DELETE FROM Click;");
    await prisma.$executeRawUnsafe("DELETE FROM Link;");
});

describe("URL Shortener", () => {
    it("crea un link y redirige", async () => {
        const create = await request(app).post("/api/links").send({ url: "https://example.com" });
        expect(create.status).toBe(201);
        const { shortCode } = create.body;
        const redir = await request(app).get(`/${shortCode}`).redirects(0);
        expect(redir.status).toBe(302);
        expect(redir.headers["location"]).toBe("https://example.com");
    });

    it("retorna stats", async () => {
        const link = await prisma.link.findFirst();
        const res = await request(app).get(`/api/links/${link!.id}/stats`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("total");
    });
});
import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";

const prisma = new PrismaClient();
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 7);

async function main() {
    await prisma.click.deleteMany();
    await prisma.link.deleteMany();

    const demo = await prisma.link.create({
        data: {
            originalUrl: "https://www.prisma.io/",
            shortCode: nanoid(),
            expiresAt: null
        }
    });

    console.log("Seed link:", demo);
}

main().finally(() => prisma.$disconnect());
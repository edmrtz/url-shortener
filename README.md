# 🔗 URL Shortener with Analytics

A simple and modern **backend API** to shorten URLs, track clicks and view basic analytics (per day, referrer, and user-agent).  
Built with **Node.js (Bun)**, **Express**, **Prisma ORM**, and **SQLite/PostgreSQL**.

---

## 🚀 Features

- ✂️ Shorten URLs with unique codes  
- 📈 Track clicks (date, referrer, user agent, IP)  
- ⏰ Optional expiration dates  
- 🧱 REST API with validation (Zod)  
- ⚙️ Rate limiting per IP  
- 🧪 Tests (Jest/Supertest)  
- 🧩 OpenAPI documentation  
- 🌱 Prisma seed for demo data  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Runtime | [Bun](https://bun.sh) |
| Framework | [Express](https://expressjs.com/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Database | SQLite (default) / PostgreSQL (optional) |
| Validation | [Zod](https://github.com/colinhacks/zod) |
| Testing | Jest + Supertest |

---
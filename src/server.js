import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { pool } from "./db.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "20kb" }));

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed"));
  }
}));

app.use("/api", rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, service: "novanumber-api" });
  } catch {
    res.status(503).json({ ok: false, error: "Database unavailable" });
  }
});

// Placeholder only. Real deposits remain disabled until authentication,
// persistence, trusted payment verification and admin authorization exist.
app.post("/api/deposits", (req, res) => {
  const schema = z.object({
    amount: z.number().finite().int().min(10).max(5000),
    reference: z.string().trim().min(6).max(100)
  }).strict();

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid deposit request" });
  }

  return res.status(501).json({
    error: "Deposit workflow is not enabled yet"
  });
});

app.use((err, _req, res, _next) => {
  console.error("Request failed:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 3000);
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

app.listen(port, "0.0.0.0", () => {
  console.log(`NovaNumber API listening on ${port}`);
});

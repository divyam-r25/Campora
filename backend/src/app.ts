import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());

// Blanket rate limit; auth routes get a tighter one below to slow brute-forcing.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again later." },
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authLimiter, authRoutes);

// Future modules mount here the same way:
// app.use("/api/announcements", authMiddleware, announcementRoutes);
// app.use("/api/events", authMiddleware, eventRoutes);
// app.use("/api/groups", authMiddleware, groupRoutes);
// app.use("/api/lostfound", authMiddleware, lostFoundRoutes);
// app.use("/api/marketplace", authMiddleware, marketplaceRoutes);
// app.use("/api/attendance", authMiddleware, attendanceRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

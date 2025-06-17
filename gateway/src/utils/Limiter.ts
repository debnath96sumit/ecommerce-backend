import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: "Too many requests to /auth, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

// Simple liveness probe
router.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Readiness probe: check mongoose connection state
router.get("/ready", (req, res) => {
  const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
  if (state === 1) {
    return res.json({ db: "up" });
  }
  return res.status(503).json({ db: "down", state });
});

export default router;

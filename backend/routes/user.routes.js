import { Router } from "express";
import { listUsers, getUserById } from "../controllers/user.controller.js";

const router = Router();

// Expose list at GET / (will be mounted at /user)
router.get("/", listUsers);
router.get("/:id", getUserById);

export default router;

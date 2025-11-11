// routes/user.routes.js
import { Router } from "express";
import { listUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";

const router = Router();

router.get("/", requireAuth, requirePermission("user:read"), listUsers);
router.get("/:id", requireAuth, requirePermission("user:read"), getUserById);
router.post("/", requireAuth, requirePermission("user:create"), createUser);
router.patch("/:id", requireAuth, requirePermission("user:update"), updateUser);
router.delete("/:id", requireAuth, requirePermission("user:delete"), deleteUser);

export default router;

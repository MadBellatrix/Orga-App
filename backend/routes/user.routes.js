// routes/user.routes.js
import { Router } from "express";
import { listUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { validateBody } from "../middleware/validate.js";
import { createUserSchema, updateUserSchema } from "../validators/user.schema.js";

const router = Router();

router.get("/", requireAuth, requirePermission("user:read"), listUsers);
router.get("/:id", requireAuth, requirePermission("user:read"), getUserById);

router.post("/",
  requireAuth,
  requirePermission("user:create"),
  validateBody(createUserSchema),
  createUser
);

router.patch("/:id",
  requireAuth,
  requirePermission("user:update"),
  validateBody(updateUserSchema),
  updateUser
);

router.delete("/:id",
  requireAuth,
  requirePermission("user:delete"),
  deleteUser
);

export default router;

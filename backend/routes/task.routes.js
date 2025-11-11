/*
Endpunkte für Aufgabenverwaltung.
*/

import { Router } from "express";
import { listTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission, requirePermissionOrOwner } from "../middleware/rbac.js";
import Task from "../models/task.model.js";

const router = Router();

const loadTaskOwner = async (req) => {
 const doc = await Task.findById(req.params.id).select("createdBy");
  return doc?.createdBy;
};

router.get("/", listTasks);
router.get("/:id", getTaskById);
router.post("/", requireAuth, requirePermission("task:create"), createTask);
router.patch("/:id", requireAuth, requirePermissionOrOwner("task:update", loadTaskOwner), updateTask);
router.delete("/:id",requireAuth,requirePermission("task:delete"), deleteTask);

export default router;


/*
Endpunkte für Aufgabenverwaltung.
*/

import { Router } from "express";
import { listTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";

const router = Router();

router.get("/", listTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask)

export default router;

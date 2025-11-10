/*
Endpunkte für Aufgabenverwaltung.
*/

import { Router } from "express";
import { listTasks, getTaskById, createTask } from "../controllers/task.controller.js";

const router = Router();

router.get("/", listTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);

export default router;

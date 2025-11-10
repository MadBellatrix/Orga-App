/*
Endpunkte für Aufgabenverwaltung.
*/

import { Router } from "express";
import { listTasks, getTaskById } from "../controllers/task.controller.js";

const router = Router();

router.get("/", listTasks);
router.get("/:id", getTaskById);

export default router;

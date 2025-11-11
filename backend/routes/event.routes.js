/*
Endpunkte für Event-Management.
*/

import { Router } from "express";
import { listEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission, requirePermissionOrOwner } from "../middleware/rbac.js";
import Event from "../models/event.model.js";

const router = Router();

const loadEventOwner = async (req) => {
  const doc = await Event.findById(req.params.id).select("createdBy");
  return doc?.createdBy;
};

router.get("/", listEvents);
router.get("/:id", getEventById);

router.post("/", requireAuth, requirePermission("event:create"), createEvent);
router.patch("/:id", requireAuth, requirePermissionOrOwner("event:update", loadEventOwner), updateEvent);
router.delete("/:id", requireAuth, requirePermission("event:delete"), deleteEvent);

export default router;

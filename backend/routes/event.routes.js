/*
Endpunkte für Event-Management.
*/
import { Router } from "express";
import { listEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission, requirePermissionOrOwner } from "../middleware/rbac.js";
import Event from "../models/event.model.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { createEventSchema, updateEventSchema, listEventQuerySchema } from "../validators/event.schema.js";

const router = Router();

const loadEventOwner = async (req) => {
  const doc = await Event.findById(req.params.id).select("createdBy");
  return doc?.createdBy;
};

router.get("/", validateQuery(listEventQuerySchema), listEvents);
router.get("/:id", getEventById);

router.post("/", requireAuth, requirePermission("event:create"), validateBody(createEventSchema), createEvent);

router.patch("/:id",
  requireAuth,
  requirePermissionOrOwner("event:update", loadEventOwner),
  validateBody(updateEventSchema),
  updateEvent
);

router.delete("/:id", requireAuth, requirePermission("event:delete"), deleteEvent);

export default router;


/*
Endpunkte für Event-Management.
*/
import { Router } from "express";
import { listEvents } from "../controllers/event.controller.js";


const router = Router();


router.get("/", listEvents);
// router.get("/:id", getEventById);
// router.post("/", createEvent);
// router.patch("/:id", updateEvent);
// router.delete("/:id", deleteEvent);


export default router;


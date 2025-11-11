/*
Endpunkte für Einladungen.
*/

import { Router } from "express";
import { listInvitations, getInvitationById, createInvitation, updateInvitation, deleteInvitation, acceptInvitation
} from "../controllers/invitation.controller.js";

const router = Router();

router.get("/", listInvitations);
router.get("/:id", getInvitationById);
router.post("/", createInvitation);
router.patch("/:id", updateInvitation);
router.delete("/:id", deleteInvitation);


router.post("/accept", acceptInvitation);

export default router;
/*
Endpunkte für Einladungen.
*/
import { Router } from "express";
import { listInvitations, getInvitationById, createInvitation, updateInvitation, deleteInvitation, acceptInvitation } from "../controllers/invitation.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { validateBody } from "../middleware/validate.js";
import { createInvitationSchema, updateInvitationSchema } from "../validators/invitation.schema.js";

const router = Router();

router.get("/", requireAuth, requirePermission("invitation:read"), listInvitations);
router.get("/:id", requireAuth, requirePermission("invitation:read"), getInvitationById);

router.post("/",
    requireAuth,
    requirePermission("invitation:create"),
    validateBody(createInvitationSchema),
    createInvitation
);

router.patch("/:id",
    requireAuth,
    requirePermission("invitation:update"),
    validateBody(updateInvitationSchema),
    updateInvitation
);

router.delete("/:id",
    requireAuth,
    requirePermission("invitation:delete"),
    deleteInvitation
);


router.post("/invitations/accept", acceptInvitation);

export default router;

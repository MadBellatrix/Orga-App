import Joi from "joi";

export const createInvitationSchema = Joi.object({
  email: Joi.string().email().required(),
  invitedBy: Joi.string().optional(),
  role: Joi.string().valid("superadmin", "admin", "player", "guest").optional(),
  event: Joi.string().optional(),
  expiresAt: Joi.date().optional()
});

export const updateInvitationSchema = Joi.object({
  status: Joi.string().valid("pending", "accepted", "declined", "expired", "cancelled").optional(),
  expiresAt: Joi.date().optional()
}).min(1);
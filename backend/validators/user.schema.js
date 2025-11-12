import Joi from "joi";

export const createUserSchema = Joi.object({
  displayName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  roles: Joi.array().items(Joi.string().valid("superadmin", "admin", "player", "guest")).optional()
});

export const updateUserSchema = Joi.object({
  displayName: Joi.string().min(2).optional(),
  roles: Joi.array().items(Joi.string().valid("superadmin", "admin", "player", "guest")).optional(),
  status: Joi.string().valid("active", "pending", "disabled").optional()
}).min(1);
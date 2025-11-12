import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().allow("").optional(),
  status: Joi.string().valid("open","in_progress","done").optional(),
  priority: Joi.string().valid("low","medium","high").optional(),
  dueAt: Joi.date().optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

export const updateTaskSchema = createTaskSchema.min(1);

// 👇 optional: Query-Validation für die Liste
export const listTaskQuerySchema = Joi.object({
  status: Joi.string().valid("open","in_progress","done").optional(),
  priority: Joi.string().valid("low","medium","high").optional(),
  q: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().optional()
});

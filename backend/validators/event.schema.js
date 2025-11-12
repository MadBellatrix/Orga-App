import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().optional(),
  type: Joi.string().valid("mission", "raid", "meeting", "training").optional(),
  difficulty: Joi.number().integer().min(1).max(5).optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  status: Joi.string().valid("open", "in_progress", "done", "cancelled").optional(),
  startAt: Joi.date().required(),
  endAt: Joi.date().optional(),
  reminderAt: Joi.date().optional(),
  repeat: Joi.string().valid("none", "daily", "weekly", "monthly").optional(),
  participants: Joi.array().items(
    Joi.object({
      user: Joi.string().required(),
      status: Joi.string().valid("invited", "accepted", "declined", "maybe").optional(),
      note: Joi.string().optional()
    })
  ).optional(),
  assignees: Joi.array().items(Joi.string()).optional(),
  createdBy: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  visibility: Joi.string().valid("public", "team", "private").optional(),
  meta: Joi.object({
    game: Joi.string().optional(),
    location: Joi.string().optional(),
    missionCode: Joi.string().optional(),
    lootTarget: Joi.number().optional(),
    requiredItems: Joi.array().items(Joi.string()).optional()
  }).optional()
});


export const listEventQuerySchema = Joi.object({
  type: Joi.string().valid("mission","raid","meeting","training").optional(),
  status: Joi.string().valid("open","in_progress","done","cancelled").optional(),
  from: Joi.date().optional(),  // filter startAt >= from
  to: Joi.date().optional(),    // filter startAt <= to
  q: Joi.string().optional(),   // sucht im title
  visibility: Joi.string().valid("public","team","private").optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().optional() // z.B. "-startAt", "createdAt"
});


export const updateEventSchema = createEventSchema.min(1);
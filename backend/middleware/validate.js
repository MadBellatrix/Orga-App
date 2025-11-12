/*
Prüft Eingabedaten mit joi (Validierung).
*/

import Joi from "joi";

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,   // zeigt ALLE Fehler, nicht nur den ersten
    stripUnknown: true   // entfernt Felder, die nicht erlaubt sind
  });

  if (error) {
    return res.status(400).json({
      msg: "Validierung fehlgeschlagen",
      errors: error.details.map((e) => e.message)
    });
  }

  req.validated = value;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      msg: "Ungültige Query-Parameter",
      errors: error.details.map((e) => e.message)
    });
  }

  req.validatedQuery = value;
  next();
};
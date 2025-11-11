/*
Prüft Benutzerrollen und Zugriffsrechte.
*/


import { roles } from "../config/roles.js";

function hasPermission(userRoles = ["guest"], action) {
  return userRoles.some(r => roles[r]?.can?.includes(action));
}

export function requirePermission(action) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || ["guest"];
    if (hasPermission(userRoles, action)) return next();
    return res.status(403).json({ msg: `Zugriff verweigert – fehlende Berechtigung: ${action}` });
  };
}


export function requirePermissionOrOwner(action, loadOwnerId) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const userRoles = user?.roles || ["guest"];

      
      if (hasPermission(userRoles, action)) return next();

      
      if (!user) return res.status(401).json({ msg: "Nicht eingeloggt" });
      const ownerId = await loadOwnerId(req); // muss eine ObjectId/String zurückgeben
      if (ownerId && ownerId.toString() === user.id?.toString()) return next();

      return res.status(403).json({ msg: `Zugriff verweigert – weder Berechtigung "${action}" noch Eigentümer` });
    } catch (err) {
      console.error("RBAC owner check error:", err);
      return res.status(500).json({ msg: "Serverfehler bei Berechtigungsprüfung" });
    }
  };
}

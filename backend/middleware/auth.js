/*
Prüft, ob ein Nutzer eingeloggt ist (JWT).
*/

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "jwt";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ msg: "Nicht eingeloggt" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id displayName email roles status");
    if (!user) return res.status(401).json({ msg: "Benutzer nicht gefunden" });

    req.user = { id: user._id, displayName: user.displayName, email: user.email, roles: user.roles, status: user.status };
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(401).json({ msg: "Ungültiger oder abgelaufener Token" });
  }
}
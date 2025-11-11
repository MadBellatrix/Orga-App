import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"; // in Prod per ENV setzen!
const COOKIE_NAME = process.env.COOKIE_NAME || "jwt";
const COOKIE_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  try {
    const { displayName, email, password, roles } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ msg: "E-Mail bereits registriert" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      displayName,
      email,
      passwordHash,
      roles: roles && roles.length ? roles : undefined
    });

    const token = signToken({ userId: user._id, roles: user.roles });
    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: COOKIE_AGE_MS
      })
      .status(201)
      .json({ msg: "Registrierung erfolgreich", user: { id: user._id, displayName, email, roles: user.roles } });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ msg: "Serverfehler bei der Registrierung" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Ungültige Anmeldedaten" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ msg: "Ungültige Anmeldedaten" });

    const token = signToken({ userId: user._id, roles: user.roles });
    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: COOKIE_AGE_MS
      })
      .json({ msg: "Login erfolgreich", user: { id: user._id, displayName: user.displayName, email: user.email, roles: user.roles } });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ msg: "Serverfehler beim Login" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: false });
    res.json({ msg: "Logout erfolgreich" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ msg: "Serverfehler beim Logout" });
  }
}

export async function me(req, res) {
  try {
    // requireAuth setzt req.user
    if (!req.user) return res.status(401).json({ msg: "Nicht eingeloggt" });
    res.json({ user: req.user });
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ msg: "Serverfehler" });
  }
}
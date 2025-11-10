import User from "../models/user.model.js";

export async function listUsers(req, res) {
  try {
    const users = await User.find().select("displayName roles status createdAt updatedAt");
    res.json(users);
  } catch (err) {
    console.error("listUsers error:", err);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function getUserById(req, res) {
  try {
    const u = await User.findById(req.params.id).select("displayName roles status createdAt updatedAt");
    if (!u) return res.status(404).json({ msg: "User nicht gefunden" });
    res.json(u);
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function createUser(req, res) {
  try {
    const { displayName, roles = ["player"], status = "active" } = req.body;

    const user = await User.create({ displayName, roles, status });

    res.status(201).json({
      msg: "Benutzer erfolgreich erstellt",
      user
    });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ msg: "Serverfehler beim Erstellen des Benutzers" });
  }
}
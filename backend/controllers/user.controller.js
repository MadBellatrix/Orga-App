import mongoose from "mongoose";
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


export async function updateUser(req, res) {
  try {
    const { id } = req.params;

   
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Benutzer-ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,       
      runValidators: true 
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "Benutzer nicht gefunden" });
    }

    res.json({
      msg: "Benutzer erfolgreich aktualisiert",
      user: updatedUser
    });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ msg: "Serverfehler beim Aktualisieren" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // prüfen, ob ID formal gültig ist
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Benutzer-ID" });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: "Benutzer nicht gefunden" });
    }

    res.json({ msg: `Benutzer "${deleted.displayName}" wurde gelöscht.` });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ msg: "Serverfehler beim Löschen" });
  }
}

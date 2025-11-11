import mongoose from "mongoose";
import crypto from "crypto";
import Invitation from "../models/invitation.model.js";


export async function listInvitations(req, res) {
  try {
    const items = await Invitation.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("listInvitations error:", err);
    res.status(500).json({ msg: "Serverfehler beim Abrufen der Einladungen" });
  }
}


export async function getInvitationById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Einladung-ID" });
    }
    const inv = await Invitation.findById(id);
    if (!inv) return res.status(404).json({ msg: "Einladung nicht gefunden" });
    res.json(inv);
  } catch (err) {
    console.error("getInvitationById error:", err);
    res.status(500).json({ msg: "Serverfehler beim Abrufen der Einladung" });
  }
}


export async function createInvitation(req, res) {
  try {
    const { email, invitedBy, expiresAt, role, event } = req.body;

    const token = crypto.randomBytes(24).toString("hex");
    const exp = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const inv = await Invitation.create({
      email,
      invitedBy,   
      role,       
      event,       
      token,
      status: "pending",
      expiresAt: exp
    });

    res.status(201).json({ msg: "Einladung erstellt", invitation: inv });
  } catch (err) {
    console.error("createInvitation error:", err);
    res.status(500).json({ msg: "Serverfehler beim Erstellen der Einladung" });
  }
}


export async function updateInvitation(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Einladung-ID" });
    }
    const updated = await Invitation.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ msg: "Einladung nicht gefunden" });
    res.json({ msg: "Einladung aktualisiert", invitation: updated });
  } catch (err) {
    console.error("updateInvitation error:", err);
    res.status(500).json({ msg: "Serverfehler beim Aktualisieren der Einladung" });
  }
}


export async function deleteInvitation(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Einladung-ID" });
    }
    const deleted = await Invitation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Einladung nicht gefunden" });
    res.json({ msg: `Einladung für "${deleted.email}" wurde gelöscht.` });
  } catch (err) {
    console.error("deleteInvitation error:", err);
    res.status(500).json({ msg: "Serverfehler beim Löschen der Einladung" });
  }
}


export async function acceptInvitation(req, res) {
  try {
    const { token, acceptedBy } = req.body; // acceptedBy = UserId (optional)
    if (!token) return res.status(400).json({ msg: "Token fehlt" });

    const inv = await Invitation.findOne({ token });
    if (!inv) return res.status(404).json({ msg: "Einladung nicht gefunden" });

    if (inv.status !== "pending") {
      return res.status(400).json({ msg: `Einladung ist bereits "${inv.status}"` });
    }
    if (inv.expiresAt && inv.expiresAt < new Date()) {
      inv.status = "expired";
      await inv.save();
      return res.status(400).json({ msg: "Einladung abgelaufen" });
    }

    inv.status = "accepted";
    inv.acceptedAt = new Date();
    if (acceptedBy) inv.acceptedBy = acceptedBy;
    await inv.save();

    res.json({ msg: "Einladung akzeptiert", invitation: inv });
  } catch (err) {
    console.error("acceptInvitation error:", err);
    res.status(500).json({ msg: "Serverfehler beim Akzeptieren der Einladung" });
  }
}

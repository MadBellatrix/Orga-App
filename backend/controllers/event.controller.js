/*
CRUD-Logik für Events (Loottouren, Termine).
*/

import mongoose from "mongoose";
import Event from "../models/event.model.js";

export async function listEvents(req, res) {
  try {
    const q = req.validatedQuery || req.query || {};

    const query = {};
    if (q.type) query.type = q.type;
    if (q.status) query.status = q.status;
    if (q.visibility) query.visibility = q.visibility;
    if (q.q) query.title = { $regex: q.q, $options: "i" };

    // Zeitfenster: auf startAt filtern
    if (q.from || q.to) {
      query.startAt = {};
      if (q.from) query.startAt.$gte = new Date(q.from);
      if (q.to)   query.startAt.$lte = new Date(q.to);
    }

    const page = Number(q.page || 1);
    const limit = Number(q.limit || 20);
    const sort = q.sort || "-startAt";
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Event.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("assignees", "displayName email")
        .populate("createdBy", "displayName email"),
      Event.countDocuments(query)
    ]);

    res.set("X-Total-Count", String(total));
    res.json(items);
  } catch (err) {
    console.error("listEvents error:", err);
    res.status(500).json({ msg: "Serverfehler" });
  }
}

export async function getEventById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Event-ID" });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ msg: "Event nicht gefunden" });

    res.json(event);
  } catch (err) {
    console.error("getEventById error:", err);
    res.status(500).json({ msg: "Serverfehler beim Abrufen des Events" });
  }
}


export async function createEvent(req, res) {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({
            msg: "Event erfolgreich erstellt", event
        });
    } catch (err) {
        console.error("createEvent error:", err);
        res.status(500).json({ msg: "Serverfehler beim Erstellen des Event"})
    }
}

export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Event-ID" });
    }

    const updated = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ msg: "Event nicht gefunden" });

    res.json({ msg: "Event aktualisiert", event: updated });
  } catch (err) {
    console.error("updateEvent error:", err);
    res.status(500).json({ msg: "Serverfehler beim Aktualisieren des Events" });
  }
}

export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Event-ID" });
    }

    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Event nicht gefunden" });

    res.json({ msg: `Event "${deleted.title}" wurde gelöscht.` });
  } catch (err) {
    console.error("deleteEvent error:", err);
    res.status(500).json({ msg: "Serverfehler beim Löschen des Events" });
  }
}
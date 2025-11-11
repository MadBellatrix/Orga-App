/*
CRUD-Logik für Events (Loottouren, Termine).
*/

import mongoose from "mongoose";
import Event from "../models/event.model.js";

export async function listEvents(req, res) {
    try {
        const events = await Event.find().sort({ createdAt: -1});
        res.json(events);
    } catch (err) {
        console.error("listEvents error:", err);
        res.status(500).json({msg: "Serverfehler beim Abrufen der Tasks"});
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
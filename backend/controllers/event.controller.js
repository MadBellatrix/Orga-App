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

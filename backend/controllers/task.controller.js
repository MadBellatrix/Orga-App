/*
Erstellung, Bearbeitung und Löschung von Aufgaben.
*/

import mongoose from "mongoose";
import Task from "../models/task.model.js";



export async function listTasks(req, res) {
  try {
    const q = req.validatedQuery || req.query || {};
    const query = {};

    if (q.status) query.status = q.status;
    if (q.priority) query.priority = q.priority;
    if (q.q) query.title = { $regex: q.q, $options: "i" };

    const page = Number(q.page || 1);
    const limit = Number(q.limit || 20);
    const sort = q.sort || "-createdAt";
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Task.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "displayName email"),
      Task.countDocuments(query)
    ]);

    res.set("X-Total-Count", String(total));
    res.json(items);
  } catch (err) {
    console.error("listTasks error:", err);
    res.status(500).json({ msg: "Serverfehler" });
  }
}


export async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Task-ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: "Task nicht gefunden" });
    }

    res.json(task);
  } catch (err) {
    console.error("getTaskById error:", err);
    res.status(500).json({ msg: "Serverfehler beim Abrufen der Task" });
  }
}

export async function createTask(req, res) {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({
      msg: "Task erfolgreich erstellt",
      task
    });
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ msg: "Serverfehler beim Erstellen der Task" });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;

    // Prüfen, ob die ID gültig ist
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Ungültige Task-ID" });
    }

  
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,          
      runValidators: true 
    });

    if (!updatedTask) {
      return res.status(404).json({ msg: "Task nicht gefunden" });
    }

    res.json({
      msg: "Task erfolgreich aktualisiert",
      task: updatedTask
    });
  } catch (err) {
    console.error("updateTask error:", err);
    res.status(500).json({ msg: "Serverfehler beim Aktualisieren der Task" });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Ungültige Task-ID" });

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "Task nicht gefunden" });
    res.json({ msg: `Task "${deleted.title}" wurde gelöscht.` });
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({ msg: "Serverfehler beim Löschen" });
  }
}
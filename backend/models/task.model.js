import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["open", "in_progress", "done", "cancelled"], default: "open" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    tags: { type: [String], default: [] },
    dueAt: { type: Date },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    meta: {
      game: String,
      quantity: Number,
      location: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);

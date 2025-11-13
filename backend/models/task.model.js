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

taskSchema.index({ createdAt: -1 });
taskSchema.index({ status: 1, priority: 1, createdAt: -1 });
// Indexes for common queries
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ priority: 1, dueAt: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ dueAt: 1 });
// Text search across title + description
taskSchema.index({ title: 'text', description: 'text' });


export default mongoose.model("Task", taskSchema);

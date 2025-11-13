import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["mission", "raid", "meeting", "training"], default: "mission" },
    difficulty: { type: Number, enum: [1, 2, 3, 4, 5], default: 1, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["open", "in_progress", "done", "cancelled"], default: "open" },

    
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    reminderAt: { type: Date },
    repeat: { type: String, enum: ["none", "daily", "weekly", "monthly"], default: "none" },

    
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["invited", "accepted", "declined", "maybe"], default: "invited" },
        note: String
      }
    ],

    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String], default: [] },
    visibility: { type: String, enum: ["public", "team", "private"], default: "team" },
    meta: {
      game: String,
      location: String,
      missionCode: String,
      lootTarget: Number,
      requiredItems: [String]
    }
  },
  { timestamps: true }
);

eventSchema.index({ startAt: 1 });
eventSchema.index({ type: 1, visibility: 1, startAt: -1 });
eventSchema.index({ title: "text" });
// Additional indexes for event queries
eventSchema.index({ type: 1, difficulty: 1 });
eventSchema.index({ status: 1, startAt: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ 'participants.user': 1 });
// Text search across title and description
eventSchema.index({ title: 'text', description: 'text' });
// Compound indexes
eventSchema.index({ type: 1, startAt: 1 });
eventSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Event", eventSchema);

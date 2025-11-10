/*
Definition der Rollen (Superadmin, Admin, Player, Guest).
*/

import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["superadmin", "admin", "player", "guest"]
    },
    description: { type: String },
    permissions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);

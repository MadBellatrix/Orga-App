import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true }, // Benutzername / Anzeigename
    roles: {
      type: [String],
      enum: ["superadmin", "admin", "player", "guest"],
      default: ["player"]
    },
    status: {
      type: String,
      enum: ["active", "pending", "disabled"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

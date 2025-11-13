import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    roles: {
      type: [String],
      enum: ["superadmin", "admin", "player", "guest"],
      default: ["player"]
    },
    status: { type: String, enum: ["active", "pending", "disabled"], default: "active" }
  },
  { timestamps: true }
);

userSchema.index({ displayName: 1 });
userSchema.index({ roles: 1 });
// Additional indexes for performance
userSchema.index({ createdAt: -1 });
// text search across displayName and email
userSchema.index({ displayName: 'text', email: 'text' });

export default mongoose.model("User", userSchema);

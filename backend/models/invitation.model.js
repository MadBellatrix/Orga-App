/*
Struktur für Einladungen (E-Mail, Token, Ablaufdatum).
*/

/*
Schema für Einladungen (Spieler, Admins, Team-Events).
*/

import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    // Wer hat die Einladung verschickt?
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Optional: Für welche Rolle oder welches Event?
    role: { type: String, enum: ["superadmin", "admin", "player", "guest"], default: "player" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },

    // Sicherheits-Token (z. B. für Einladung per E-Mail-Link)
    token: { type: String, required: true, unique: true },

    // Status: pending = offen, accepted = angenommen, declined = abgelehnt, expired = abgelaufen
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired", "cancelled"],
      default: "pending"
    },

    // Ablauf und Zeitstempel
    expiresAt: { type: Date },
    acceptedAt: { type: Date },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// Automatisch abgelaufene Einladungen beim Abruf erkennen
invitationSchema.pre(/^find/, function (next) {
  this.where({
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gte: new Date() } },
      { status: { $in: ["accepted", "declined", "cancelled"] } }
    ]
  });
  next();
});

// Indexes
invitationSchema.index({ email: 1 });
// token is already declared unique on the field, avoid duplicate index declaration
invitationSchema.index({ status: 1 });
invitationSchema.index({ expiresAt: 1 });
invitationSchema.index({ event: 1 });
invitationSchema.index({ invitedBy: 1 });
invitationSchema.index({ email: 1, status: 1 });

export default mongoose.model("Invitation", invitationSchema);

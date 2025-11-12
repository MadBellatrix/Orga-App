/*
Zum Ausführen: node --env-file=.env scripts/seed.js
Erstellt: 1 Superadmin (admin@example.com / admin) + 10 Events
*/

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";

const { MONGODB_URI, DATABASE } = process.env;

async function run() {
  try {
    if (!MONGODB_URI) {
      console.error("MONGODB_URI fehlt. Bitte als ENV Variable setzen.");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI, { dbName: DATABASE });
    console.log(`✅ Verbunden mit MongoDB (uri=${MONGODB_URI}, db=${DATABASE || "<default>"})`);

    // Aufräumen
    await Promise.all([User.deleteMany({}), Event.deleteMany({})]);

    // Superadmin anlegen
    const passwordHash = await bcrypt.hash("admin", 10);
    const superadmin = await User.create({
      displayName: "Superadmin",
      email: "admin@example.com",
      roles: ["superadmin"],
      passwordHash
    });

    console.log(`👤 Superadmin angelegt: ${superadmin.displayName} (${superadmin.email})`);

    const UID = superadmin._id;

    // 10 Events
    const sampleEvents = [
      {
        title: "Raid auf die Nordfestung",
        description: "Gemeinsame Mission zur Eroberung der Nordfestung und Sicherung der Ressourcen.",
        type: "raid",
        difficulty: 4,
        priority: "high",
        status: "open",
        startAt: new Date("2025-11-20T18:00:00.000Z"),
        endAt: new Date("2025-11-20T21:00:00.000Z"),
        participants: [{ user: UID, status: "accepted" }],
        assignees: [UID],
        createdBy: UID,
        tags: ["raid", "nord", "bossfight"],
        visibility: "team",
        meta: {
          game: "7DaysToDie",
          location: "Nordsee-Festung",
          missionCode: "NF-001",
          lootTarget: 500,
          requiredItems: ["Axt", "Verband", "Holz"]
        }
      },
      {
        title: "Training – Verteidigung des Außenpostens",
        description: "Verteidigungsübung gegen simulierte Angriffe.",
        type: "training",
        difficulty: 2,
        priority: "medium",
        status: "open",
        startAt: new Date("2025-11-15T16:00:00.000Z"),
        endAt: new Date("2025-11-15T18:00:00.000Z"),
        participants: [{ user: UID, status: "accepted" }],
        assignees: [UID],
        createdBy: UID,
        tags: ["training", "defense"],
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Südposten", missionCode: "TR-002" }
      },
      {
        title: "Missionsbesprechung – Wintervorbereitung",
        description: "Planung der Ressourcen und Verteidigung für den kommenden Winter.",
        type: "meeting",
        difficulty: 1,
        priority: "low",
        status: "open",
        startAt: new Date("2025-11-13T19:00:00.000Z"),
        participants: [{ user: UID, status: "invited" }],
        assignees: [UID],
        createdBy: UID,
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Zentralbasis" }
      },
      {
        title: "Mission – Erkundung des Ostwaldes",
        description: "Scouting neuer Gebiete und Aufklärung potenzieller Feindlager.",
        type: "mission",
        difficulty: 3,
        priority: "medium",
        status: "in_progress",
        startAt: new Date("2025-11-18T12:00:00.000Z"),
        endAt: new Date("2025-11-18T15:00:00.000Z"),
        participants: [{ user: UID, status: "accepted" }],
        assignees: [UID],
        createdBy: UID,
        tags: ["exploration", "forest"],
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Ostwald", lootTarget: 200 }
      },
      {
        title: "Raid – Zombiedorf im Süden",
        description: "Südlicher Angriff auf verseuchte Dörfer, Ziel: Gebiet säubern.",
        type: "raid",
        difficulty: 5,
        priority: "high",
        status: "open",
        startAt: new Date("2025-11-25T20:00:00.000Z"),
        participants: [{ user: UID, status: "accepted" }],
        assignees: [UID],
        createdBy: UID,
        tags: ["raid", "south", "cleanup"],
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Südliches Dorf", missionCode: "SD-003" }
      },
      {
        title: "Loot-Tour – Krankenhaus",
        description: "Medizinische Vorräte sichern. Fokus: Antibiotika und Bandagen.",
        type: "mission",
        difficulty: 2,
        priority: "high",
        status: "open",
        startAt: new Date("2025-11-17T17:00:00.000Z"),
        endAt: new Date("2025-11-17T19:00:00.000Z"),
        participants: [{ user: UID, status: "accepted" }],
        assignees: [UID],
        createdBy: UID,
        tags: ["loot", "medic"],
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Altes Krankenhaus" }
      },
      {
        title: "Teamtreffen – Strategieplanung Dezember",
        description: "Strategische Planung und Aufgabenverteilung für den nächsten Monat.",
        type: "meeting",
        difficulty: 1,
        priority: "low",
        status: "open",
        startAt: new Date("2025-11-30T18:00:00.000Z"),
        participants: [{ user: UID, status: "invited" }],
        assignees: [UID],
        createdBy: UID,
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Zentralbasis" }
      },
      {
        title: "Training – Nachteinsatz",
        description: "Nachtkampfübung mit Fokus auf Tarnung und Koordination.",
        type: "training",
        difficulty: 3,
        priority: "medium",
        status: "open",
        startAt: new Date("2025-11-22T22:00:00.000Z"),
        endAt: new Date("2025-11-23T00:00:00.000Z"),
        participants: [{ user: UID, status: "accepted" }],
        assignees: [UID],
        createdBy: UID,
        tags: ["training", "night"],
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Schwarzforst" }
      },
      {
        title: "Mission – Bergwerk säubern",
        description: "Minenbereich von Infizierten befreien, Ressourcen sichern.",
        type: "mission",
        difficulty: 4,
        priority: "high",
        status: "open",
        startAt: new Date("2025-11-19T14:00:00.000Z"),
        participants: [{ user: UID, status: "accepted" }],
        assignees: [UID],
        createdBy: UID,
        tags: ["mission", "mine"],
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Bergwerk Alpha" }
      },
      {
        title: "Raid – Wüstenbasis",
        description: "Feindbasis in der Wüste stürmen, Beute sichern.",
        type: "raid",
        difficulty: 5,
        priority: "high",
        status: "open",
        startAt: new Date("2025-11-28T20:00:00.000Z"),
        participants: [{ user: UID, status: "accepted" }],
        assignees: [UID],
        createdBy: UID,
        tags: ["raid", "desert"],
        visibility: "team",
        meta: { game: "7DaysToDie", location: "Wüstenbasis Gamma" }
      }
    ];

    const inserted = await Event.insertMany(sampleEvents);
    console.log(`📦 ${inserted.length} Events hinzugefügt.`);
    inserted.forEach(e => console.log(`  • ${e.title}`));

    console.log("✅ Seed abgeschlossen.");
  } catch (err) {
    console.error("❌ Fehler beim Seeding:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Verbindung geschlossen");
  }
}

run();

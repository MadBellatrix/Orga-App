/*
Zum Ausführen: node --env-file=.env  scripts/seed.js
*/

import mongoose from "mongoose";
import User from "../models/user.model.js";

const { MONGODB_URI, DATABASE } = process.env;

async function run() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI fehlt. Bitte als ENV Variable setzen.");
    process.exit(1);
  }

  // Verwende die option `dbName`, damit die in .env angegebene DATABASE verwendet wird
  // (robuster als einfaches Anhängen an die URI)
  await mongoose.connect(MONGODB_URI, { dbName: DATABASE });
  console.log(`✅ Verbunden mit MongoDB (uri=${MONGODB_URI}, db=${DATABASE || '<default>'})`);

  
  await User.deleteMany({});

  const users = await User.create([
    { displayName: "Valandor", roles: ["superadmin"] },
    { displayName: "Maeve", roles: ["admin"] },
    { displayName: "Hilda", roles: ["player"] }
  ]);

  console.log("👤 Seed abgeschlossen. Angelegte Benutzer:");
  users.forEach(u => console.log(`- ${u.displayName} (${u.roles.join(", ")})`));

  await mongoose.disconnect();
  console.log("🔌 Verbindung geschlossen");
}

run().catch(err => {
  console.error("❌ Fehler beim Seeding:", err);
  process.exit(1);
});



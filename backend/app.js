/*
app.js
Erstellt die Express-App, bindet Middleware und alle API-Routen ein.
*/

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import eventRoutes from "./routes/event.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));

// Für lokale Entwicklung: Origin frei + Credentials
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/events", eventRoutes);
app.use("/invitations", invitationRoutes);


// Health
app.get("/api/v1/health", (_, res) => res.json({ ok: true }));

export default app;
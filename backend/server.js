import express from "express";
import connectDB from "./libs/dbConnect.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import eventRouter from "./routes/event.routes.js";
import inviteRouter from "./routes/invitation.routes.js"
import authRouter from "./routes/auth.routes.js";
import healthRouter from "./routes/health.routes.js";

connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/user", userRouter);
// Health & readiness
app.use("/", healthRouter);
app.use("/task", taskRouter);
app.use("/event", eventRouter);
app.use("/invite", inviteRouter)
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
});

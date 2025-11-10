import express from "express";
import connectDB from "./libs/dbConnect.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";

connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());


app.use("/user", userRouter);
app.use("/task", taskRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
});

import {Router} from "express";
import * as user from "../controllers/userController.js";

const userRouter = Router();

userRouter
    .post("/", user.createUser)

export default userRouter;

import {Router} from "express";
import * as user from "../controllers/user.controller.js";

const userRouter = Router();

userRouter
    .post("/", user.createUser)

export default userRouter;

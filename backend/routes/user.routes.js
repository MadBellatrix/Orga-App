import { Router } from "express";
import { listUsers, getUserById, createUser } from "../controllers/user.controller.js";

const router = Router();


router.get("/", listUsers);
router.get("/:id", getUserById);
router.post("/", createUser);


export default router;

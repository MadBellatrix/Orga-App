import { Router } from "express";
import { listUsers, getUserById, createUser, updateUser } from "../controllers/user.controller.js";

const router = Router();


router.get("/", listUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/:id", updateUser);

export default router;

import express from "express"
import User from "../models/user.js"
import { getUsers, registerUser, loginUser, getCurrentUser, logoutUser } from "../controllers/userController.js"

const router = express.Router()

router.get("/", getUsers)

router.post("/register", registerUser)
router.post("/login", loginUser);
router.get("/me", getCurrentUser);
router.post("/logout", logoutUser);

router.delete("/", ()=>{})

export default router 

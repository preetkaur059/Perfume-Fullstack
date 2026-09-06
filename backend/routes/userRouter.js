import express from "express"
import User from "../models/user.js"
import { getUsers, registerUser, loginUser, getCurrentUser, logoutUser,  updateUser } from "../controllers/userController.js"

const router = express.Router()

router.get("/all", getUsers)

router.post("/register", registerUser)
router.post("/login", loginUser);
router.get("/me", getCurrentUser);
router.post("/logout", logoutUser);

router.patch("/:id", updateUser);

router.delete("/", ()=>{})

export default router 

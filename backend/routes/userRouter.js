import express from "express"
import { getUsers, registerUser, loginUser, refreshAccessToken, getCurrentUser, logoutUser, updateUser } from "../controllers/userController.js"
import isLoggedIn from "../middlewares/isLoggedIn.js"

const router = express.Router()

router.get("/all", getUsers)

router.post("/register", registerUser)
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.get("/me", isLoggedIn, getCurrentUser);
router.post("/logout", logoutUser);

router.patch("/:id", updateUser);

router.delete("/", ()=>{})

export default router 

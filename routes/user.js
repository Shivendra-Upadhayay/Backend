import express from "express"
const router = express.Router();
import { createuserValidator, updateUserValidator, loginInputValidator } from "../middlewares/auth.js"
import {
	signup,
	login,
	getAllUsers,
	getuserById,
	updateUser,
	deleteUser,
	logoutUser

} from "../controller/user.js"


router.post("/signup", createuserValidator, signup)

router.post("/login", loginInputValidator, login)

router.get("/getAllUsers", getAllUsers)

router.get("/:id", getuserById)

router.patch("/:id", updateUserValidator, updateUser)
router.delete("/:id", deleteUser)
router.post("/logout", logoutUser)



export default router 
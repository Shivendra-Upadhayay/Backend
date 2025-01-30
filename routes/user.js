import express from "express"

const router = express.Router();

import { auth, isStudent, isAdmin, userValidator } from "../middlewares/auth.js"



import {
	signup,
	login,
	getAllUsers,
	getuserById,
	updateUser,
	deleteUser,
	logoutUser
} from "../controller/Auth.js"

router.post("/signup", userValidator, signup)

router.post("/login", login)

router.get("/getAllUsers", getAllUsers)

router.get("/:id", getuserById)

router.patch("/:id", updateUser)
router.delete("/:id", deleteUser)
// router.all("/:id", deleteUser)
router.post("/logout", auth, logoutUser)


// protected route

router.get("/student", auth, isStudent, (req, res) => {

	return res.json(200).json({

		success: true,
		message: "welcome to student portal"
	})

})

router.get("/test", auth, isStudent, (req, res) => {

	return res.json(200).json({

		success: true,
		message: "welcome to visitor portal"
	})

})


router.get("/admin", auth, isStudent, (req, res) => {

	return res.json(200).json({

		success: true,
		message: "welcome to admin portal"
	})

})


export default router 
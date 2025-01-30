import users from "../models/users.js";
import bcrypt from 'bcrypt'; // Make sure bcrypt is imported
import dotenv from "dotenv/config"
import { userValidator } from "../middlewares/auth.js"

import jwt from "jsonwebtoken"
import mongoose from "mongoose";



const signup = async (req, res) => {
	try {
		const { name, email, password, role, age } = req.body;

		// Check if user already exists
		const existingUser = await users.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Already signed up. Please log in."
			});
		}

		// Hash password
		// let hashedPassword;
		// try {
		// 	hashedPassword = await bcrypt.hash(password, 10);
		// } catch (error) {
		// 	return res.status(500).json({
		// 		success: false,
		// 		message: "Error in hashing password"
		// 	});
		// }

		// Save user in database
		// const user = await users.create({ name, email, password: hashedPassword, role });

		const Newuser = new users({ name, email, password, role, age })

		const user = await Newuser.save();

		user.password = undefined;


		return res.status(200).json({
			success: true,
			message: "User created successfully",
			user
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "User not registered please try again"
		});
	}
};

const login = async (req, res) => {

	const { email, password } = req.body;

	if (!email || !password) {

		return res.status(404).json({
			success: false,
			message: "please fill all details carefully "
		})

	}

	let user = await users.findOne({ email })

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "please signup first"
		})
	}

	const payload = {

		id: user._id,
		email: user.email,
		role: user.role
	}


	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "2h" })
		user = user.toObject();
		user.token = token;

		user.password = undefined


		const options = {
			expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: true
		}

		res.cookie("token", token, options).status(200).json({
			success: true,
			token,
			user,
			message: "Logined successfully"
		})

	} else {

		console.log(error)

		return res.status(500).json({
			success: false,
			message: "password or email is incorrect"
		})

	}







}

const getAllUsers = async (req, res) => {
	try {
		const allUsers = await users.find();
		return res.status(200).json({

			allUsers
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json(error.message)
	}

}

const getuserById = async (req, res) => {

	try {
		const id = req.params.id;



		const user = await users.findById(id);
		// const userID = '67937426c7d771cc69d14e33'
		// const user = await users.findById(userID);

		if (!user) {
			return res.status(404).json({
				message: "user not found"
			})
		}

		return res.status(200).json(user);

	} catch (error) {
		console.error(error);
		return res.status(500).json(error.message);
	}

}

const updateUser = async (req, res) => {
	try {
		// const _id = req.params.id;

		const { _id, ...updates } = req.body;

		if (!mongoose.Types.ObjectId.isValid(_id)) {

			return res.status(403).json({
				success: false,
				message: "invalid objectId"
			})

		}

		const existingEmail = await users.findOne({ "email": updates.email })
		if (existingEmail) {
			return res.status(400).json({
				success: false,
				message: "email already exist. Please insert unique email"
			})
		}
		const updatedUser = await users.findByIdAndUpdate(_id, updates, { new: true })

		// const updatedUser = users.updateOne(

		// 	{ _id: mongoose.Types.ObjectId(_id) },
		// 	{
		// 		$set: updates

		// 	}

		// )

		if (!updatedUser) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			})
		}
		return res.status(200).json({ updatedUser })

	} catch (error) {
		console.error(error);
		return res.status(400).json(error.message);
	}

}

const deleteUser = async (req, res) => {

	try {
		const id = req.params.id;
		const deleteduser = await users.findByIdAndDelete(id);
		if (!deleteduser) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			})
		}
		return res.status(200).json({
			message: "user has deleted successfully",
			deleteduser

		})

	} catch (error) {

		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error!"
		})

	}

}

const logoutUser = async (req, res) => {

	// users.findByIdAndUpdate(
	// 	req.user.id,
	// 	{
	// 		$set:{

	// 		}
	// 	}
	// )
	const options = {
		httpOnly: true,
		secure: true
	}

	return res.status(200).clearCookie("token", options).json(
		{
			success: true,
			message: "userlogout successfully"
		}
	)

}

export {
	signup,
	login,
	getAllUsers,
	getuserById,
	updateUser,
	deleteUser,
	logoutUser
};

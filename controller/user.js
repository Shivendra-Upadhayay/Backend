import User from "../models/users.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";



const signup = async (req, res) => {
	try {
		const { name, email, password, role, age } = req.body;
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Already signed up. Please log in."
			});
		}
		const Newuser = new User({
			name,
			email,
			password,
			role,
			age
		})
		const user = await Newuser.save();; //saving new user in db

		const createUser = await User.find(user._id, { createdAt: 0, updatedAt: 0, password: false }) //removing createdAt,updatedAt and password from created user

		return res.status(200).json({
			success: true,
			message: "User created successfully",
			createUser
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message: "User not registered please try again"
		});
	}
};

const login = async (req, res) => {

	const { email, password } = req.body;

	let user = await User.findOne({ email })

	console.log("user", user)

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
		const loginedUser = await User.findOne({ email }).select("-password -createdAt -updatedAt")
		// let loginUser = loginedUser[0]._doc;
		let loginUser = loginedUser.toObject();

		loginUser.token = token
		const options = {
			expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: true
		}

		res.cookie("token", token, options).status(200).json({
			success: true,
			message: "User Logged in successfully",
			loginUser
		})

	} else {
		return res.status(500).json({
			success: false,
			message: "password is incorrect"
		})

	}

}

const getAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find();
		return res.status(200).json({
			success: false,
			message: "All users  fetched successfully!",
			allUsers
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			success: false,
			error: error.message
		})
	}

}

const getuserById = async (req, res) => {

	try {
		const _id = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid ObjectId"

			})
		}
		const user = await User.findById(_id, { password: 0, createdAt: 0, updatedAt: 0 });

		if (!user) {
			return res.status(404).json({
				message: "user not found"
			})
		}

		return res.status(200).json({
			success: true,
			message: "User fetched successfully by Id",
			user
		});

	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			success: false,
			error: error.message
		});
	}

}

const updateUser = async (req, res) => {
	try {
		const _id = req.params.id; //extracting id from params
		const { email, password } = req.body;

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(403).json({
				success: false,
				message: "invalid objectId"
			})
		}

		const existingEmail = await User.findOne({ email })
		if (existingEmail) {
			return res.status(400).json({
				success: false,
				message: "email already exist. Please insert unique email"
			})
		}
		const updatedUser = await User.findByIdAndUpdate(_id, req.body, { projection: { password: 0 }, new: true })

		if (!updatedUser) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			})
		}
		return res.status(200).json({
			success: true,
			message: "User Updated Successfully !",
			updatedUser
		})

	} catch (error) {
		console.error(error);
		return res.status(400).json(error.message);
	}

}

const deleteUser = async (req, res) => {

	try {
		const _id = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(403).json({
				success: false,
				message: "invalid objectId"
			})
		}
		const deleteduser = await User.findByIdAndDelete(_id, { projection: { password: 0, createdAt: 0, updatedAt: 0 } }); //deleting user
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
}

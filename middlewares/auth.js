import jwt from "jsonwebtoken"
import users from "../models/users.js"
import joi from "joi"




let auth = async (req, res, next) => {

	try {

		// extract jwt token
		const token = req.cookies.token || req.body.token;

		if (!token) {

			return res.status(404).json({

				success: true,
				message: "token is missing"
			})
		}


		// verify the token

		try {

			const decodeToken = jwt.verify(token, process.env.JWT_KEY);

			const user = await users.findById(decodeToken.id)

			if (!user) {
				return res.status(400).json({
					success: false,
					message: "invalid access token"
				})
			}

			console.log(decodeToken);

			req.user = user;

		} catch (error) {
			return res.status(401).json({
				success: false,
				message: "token is not matching"
			})
		}

		next();

	} catch (error) {

		return res.status(401).json({

			success: false,
			message: "something went wrong while verifying the token "
		})
	}
}

let isStudent = (req, res, next) => {

	try {


		if (req.user.role !== "student") {

			return res.status(401).json({
				success: false,
				message: "this is protected route for student"
			})
		}

		next();

	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "role is not verifying for student"
		})

	}
}


let isAdmin = (req, res, next) => {

	try {


		if (req.user.role !== "admin") {

			return res.status(401).json({
				success: false,
				message: "this is protected route for admin"
			})
		}

		next();

	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "role is not verifying for admin"
		})

	}
}

let userValidator = async (req, res, next) => {
	// const { name, email, password } = req.body;

	// const userInfo = {
	// 	name,
	// 	email,
	// 	password
	// }
	const joiUserSchema = joi.object({
		name: joi.string().alphanum().min(5).max(10).required(),
		email: joi.string().email().required(),
		password: joi.string().alphanum().min(3).max(10)

	}).unknown(true);

	const { error } = joiUserSchema.validate(req.body);
	if (error) {
		return res.status(400).json({
			error: error.details[0].message
		})
	}

	next();

}


export {
	auth,
	isStudent,
	isAdmin,
	userValidator
}
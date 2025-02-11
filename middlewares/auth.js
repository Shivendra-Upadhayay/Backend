
import joi from "joi"
import { joiPasswordExtendCore } from "joi-password"
const joiPassword = joi.extend(joiPasswordExtendCore);


//adding validation while user is signup
let createuserValidator = async (req, res, next) => {
	const joiUserSchema = joi.object({
		name: joi.string().alphanum().max(20).required(),
		email: joi.string().email().required(),
		password: joiPassword
			.string()
			.minOfSpecialCharacters(1)
			.minOfLowercase(1)
			.minOfUppercase(1)
			.minOfNumeric(1)
			.noWhiteSpaces()
			.onlyLatinCharacters()
			.doesNotInclude(['password'])
			.required().min(5),
		role: joi.string().valid("student", "admin", "visitor").required()
	})

	const { error } = joiUserSchema.validate(req.body, { abortEarly: false });
	if (error) {
		return res.status(400).json({
			message: "Validation failed !",
			error: error.details.map(detail => detail.message.replace(/"/g, ''))
		})
	}
	next();
}
//Adding validation while user is updating 
let updateUserValidator = async (req, res, next) => {
	const updateUserSchema = joi.object({
		name: joi.string().optional(),
		role: joi.string().valid("student", "admin", "visitor").optional()
	})
	const { error } = updateUserSchema.validate(req.body, { abortEarly: false })
	if (error) {
		return res.status(400).json({
			success: false,
			message: "Validation Failed",
			error: error.details.map(detail => detail.message.replace(/"/g, ''))
		})
	}

	next()
}
//Adding validation when user is logging
let loginInputValidator = async (req, res, next) => {
	const loginSchema = joi.object({
		email: joi.string().email().required(),
		password: joi.string().required()
	}).unknown(false)
	const { error } = loginSchema.validate(req.body, { abortEarly: false })

	if (error) {
		return res.status(400).json({
			success: false,
			message: "Validation Failed!",
			error: error.details.map(detail => detail.message.replace(/"/g, ''))
		})
	}

	next();
}

// Adding Validation when product is adding
const productValidator = async (req, res, next) => {

	const product = joi.object({
		id: joi.number().required(),
		title: joi.string().alphanum().min(3).max(10).required(),
		price: joi.number().required().min(0),
		description: joi.string().required(),
		category: joi.string().valid("men's clothing", "women's clothing", "jewellery", "electronics").required(),
		rate: joi.number().required().min(1),
		count: joi.number().required().min(0)
	})
	const { error } = await product.validate(req.body, { abortEarly: false });

	let errors = []

	if (error) {
		errors = error.details.map(detail => { return detail.message.replace(/"/g, '') })
	}

	if (!req.file) {
		errors.push("Image is required")
	}

	if (errors.length > 0) {
		return res.status(403).json({
			message: "Validation failed",
			success: false,
			errors
		})
	}

	next();
}
// Adding validation when product is updating
const updateProductValidator = async (req, res, next) => {
	const product = joi.object({
		title: joi.string().alphanum().min(3).max(10),
		price: joi.number().min(0),
		description: joi.string(),
		category: joi.string().valid("men's clothing", "women's clothing", "jewellery", "electronics"),
		rate: joi.number().min(1),
		count: joi.number().min(0)
	})

	const { error } = await product.validate(req.body, { abortEarly: false })

	if (error) {
		return res.status(401).json({
			message: "Validation failed",
			success: false,
			error: error.details.map(detail => {
				return detail.message.replace(/"/g, '')
			})
		})
	}

	next();

}

const verifyToken = async (req, res, next) => {

	const token = req.body.token;
	if (!token) {
		return res.status(400).json({
			success: false,
			message: "token is missing"
		})
	}


}


export {
	createuserValidator,
	updateUserValidator,
	loginInputValidator,
	productValidator,
	updateProductValidator
}
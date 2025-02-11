import joi from "joi"

const joiSchema = joi.object({
	name: joi.string().alphanum().min(4).max(20).required(),
	email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com'] } }),
	password: joi.string().required()
})

export {
	joiSchema
}
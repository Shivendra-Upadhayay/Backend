import mongoose, { version } from "mongoose";

import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({


	name: {
		type: "string",
		required: true,
		trim: true
	},
	email: {
		type: "string",
		required: true,
		trim: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: "string",
		required: true,
		trim: true
	},
	role: {
		type: "string",
		enum: ["student", "admin", "visitor"]
	},
	age: {
		type: Number,
		min: [18, "age should not less than 18"]
	}

}, { timestamps: true, versionKey: false })

userSchema.pre('save', async function (next) {
	var user = this;

	//hashing password
	try {
		if (!this.isModified("password"))
			return next();
		const hashedPassword = await bcrypt.hash(user.password, 10);
		user.password = hashedPassword;
		next();

	} catch (error) {
		console.error(err);
		return res.status(500).json({
			true: false,
			message: "getting error in hashing password"
		})
	}

});

export default mongoose.model("user", userSchema)


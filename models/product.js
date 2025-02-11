import joi from "joi";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const productSchema = new mongoose.Schema({

	id: {
		type: Number,
		unique: true,
		required: true

	},
	title: {
		type: String,
		trim: true,
		required: true
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: String,
		enum: ["men's clothing", "women's clothing", "jewellery", "electronics"],
		required: true
	},
	image: {
		type: String,
		required: true
	},
	rating: {
		rate: {
			type: Number,
			required: true
		},
		count: {
			type: Number,
			required: true
		}
	}

}, { timestamps: true, versionKey: false })

const Product = mongoose.model('Product', productSchema)

export {
	Product
}
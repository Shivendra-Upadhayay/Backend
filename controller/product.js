import { Product } from "../models/product.js";
import express from "express";
import mongoose from "mongoose";
import { fileUploadOnCloudinary } from "../utility/cloudinary.js"



const addProduct = async (req, res) => {

	const { id, title, price, description, category } = req.body; // extract product detail from body

	const rating = {
		rate: req.body.rate,
		count: req.body.count
	}
	const existingProduct = await Product.findOne({ id });

	if (existingProduct) {
		return res.status(400).json({
			success: true,
			message: "Product already exist"
		})
	}

	if (!req.file) {
		return res.status(401).json({
			message: "Validation Failed",
			error: "image is required"
		})
	}


	const imageURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;



	const newProduct = new Product({
		id,
		title,
		price,
		description,
		category,
		image: imageURL,
		rating

	})

	const addProduct = await newProduct.save();

	return res.status(200).json({
		success: true,
		message: "Product Added Successfully!",
		addProduct
	})


}

const getAllProducts = async (req, res) => {
	try {
		let page = Number(req.query.page) || 1;
		let limit = 5;
		let totalProducts = await Product.countDocuments();
		let totalPages = Math.ceil(totalProducts / limit);


		const allProducts = await Product.find({
			title: {
				$regex: req.query.title, $options: "i"
			}
		}).skip((page - 1) * limit).limit(limit);

		// const allProducts = await Product.find(req.query);


		if (!allProducts) {
			return res.status(500).send({
				success: false,
				message: "No Products found!"
			})
		}

		return res.status(200).json({
			success: true,
			message: "product fetched successfully!",
			data: allProducts

		})
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "getting error in fetching products"
		})

	}
}

const getProductById = async (req, res) => {
	const _id = req.params.id;

	const product = await Product.findOne({ _id });
	if (!product) {
		return res.status(400).json({
			success: true,
			message: "Product not found with this product id"
		})
	}
	return res.status(200).json({
		product
	})
}

const updateProduct = async (req, res) => {
	try {
		const _id = req.params.id;

		if (req.body.id) {
			return res.status(404).json({
				message: "id should unique id can't update"
			})
		};

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(400).json({
				success: false, //  Change to false since it's an error
				message: "Invalid Object Id"
			});
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			_id,
			req.body,
			{
				new: true,
				runValidators: true
			});


		if (!updatedProduct) {
			return res.status(400).json({
				success: true,
				message: "Product not exist for update!"
			})
		}
		return res.status(200).json({
			success: true,
			message: "product updated",
			updatedProduct
		})

	} catch (error) {
		return res.status(500).json({
			success: true,
			error: error.message
		})
	}
}

const deleteProduct = async (req, res) => {

	try {
		const _id = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res.status(400).json({
				success: false, //  Change to false since it's an error
				message: "Invalid Object Id"
			});
		}

		const deleteProduct = await Product.findByIdAndDelete(_id);

		if (!deleteProduct) {
			return res.status(404).json({
				success: false,
				message: "Product not found"
			})
		}
		return res.status(200).json({
			success: true,
			message: "Product has deleted"
		})
	} catch (error) {

		console.error(error.stack);
		return res.status(500).json({
			success: false,
			error: error.message
		})
	}




}

export {
	addProduct,
	getAllProducts,
	getProductById,
	updateProduct,
	deleteProduct

}
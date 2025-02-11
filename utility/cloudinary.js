import { v2 as cloudinary } from "cloudinary";

import fs from "fs"

import dotenv from "dotenv/config"

// Configuration
try {
	cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.API_KEY,
		api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
	})
} catch (error) {
	console.error(error);
}

const fileUploadOnCloudinary = async (localfilepath) => {

	try {
		if (!localfilepath)
			return "Could't find path";
		const response = await cloudinary.uploader.upload(localfilepath, {
			resource_type: "auto"
		})

		console.log("file is uploaded on cloudinary", response.url);
		return response;

	} catch (error) {
		console.log(error.message)
		// fs.unlinkSync(localfilepath) //remove locally file and move to on cloudinary
		return null;
	}
}



export {
	fileUploadOnCloudinary
}
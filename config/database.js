import mongoose from "mongoose";

import dotenv from "dotenv/config";

// mongoose.set('runValidators', true);

// dotenv.config();
// "mongodb://127.0.0.1:27017/User"


const dbConnect = async () => {

	try {
		await mongoose.connect(process.env.MONGODB_URL)

		console.log("Db connected successfully !")

	} catch (error) {

		console.error(error)

		process.exit(1)
	}


}

export { dbConnect }
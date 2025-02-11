import express from "express"
import dotenv from "dotenv/config"
import cookieParser from "cookie-parser";
import path from 'path'

const app = express();

import { dbConnect } from "./config/database.js";
import user from './routes/user.js'
import product from './routes/product.js'

const PORT = process.env.PORT;

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(process.cwd(), "public/images")))

dbConnect();

// mounting 
app.use("/api/v1", user)
app.use("/api/v2", product)

app.listen(process.env.PORT, () => {
	console.log(`app is running on port ${PORT}`);
})









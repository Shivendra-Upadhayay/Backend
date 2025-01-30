import express from "express"
import dotenv from "dotenv/config"
import cookieParser from "cookie-parser";

const app = express();

import { dbConnect } from "./config/database.js";
import user from './routes/user.js'

const PORT = process.env.PORT;

// middleware
app.use(express.json())
app.use(cookieParser())

dbConnect();

// mounting 
app.use("/api/v1", user)

app.use((req, res) => {

	res.send("Page Not found!")

})


app.listen(process.env.PORT, () => {
	console.log(`app is running on port ${PORT}`);
})









import express from "express"
const app = express()
const router = express.Router();
app.use(express.urlencoded({ extended: true }))


import {
	getAllProducts,
	getProductById,
	updateProduct,
	addProduct,
	deleteProduct,

} from "../controller/product.js";


import { productValidator, updateProductValidator } from "../middlewares/auth.js"
import { upload } from "../middlewares/fileUpload.js"

router.post("/addProduct", upload.single('image'), productValidator, addProduct)
router.get("/getAllProducts", getAllProducts)
router.get("/:id", getProductById)
router.patch("/updateProduct/:id", upload.single('image'), updateProductValidator, updateProduct)
router.delete("/deleteProduct/:id", deleteProduct)

export default router


import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images')
	},
	filename: function (req, file, cb) {
		console.log(file);
		const filename = `${Date.now()}-${file.originalname}`
		cb(null, filename)
	}
})
const upload = multer({ storage: storage })

export {
	upload
}
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import multer from "multer"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.resolve(__dirname, "../temp")

// Create temp directory if not exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

//Configure multer
const storage = multer.diskStorage({
    //configure the storage
    destination(req, file, cb) {
        cb(null, uploadDir)
    }
    ,
    //configure the file name
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

//configure the file filter
const fileFilter = (req, file, cb) => {
     if(file.mimetype=="application/pdf" ||
        file.mimetype.startsWith("image/")
      ){
          
        cb(null,true)

      }else{
        cb(new Error("Only PDF and Images are allowed."))
      }
}


export default  multer({
    storage, fileFilter, limits: {
        fileSize: 20 * 1024 * 1024
    }
})
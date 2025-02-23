import multer from "multer"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp") //When you write "/public/temp", it's treated as an absolute path, which won't work correctly.
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
 export const upload = multer({ storage });
  
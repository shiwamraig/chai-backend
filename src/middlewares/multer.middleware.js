import multer from "multer" //multer is a package that handles file uploads in Express.

const storage = multer.diskStorage({ //tells Multer to store files on disk instead of memory or cloud storage.
  //destination : where the files will be stored
    destination: function (req, file, cb) {
      cb(null, "./public/temp") //When you write "/public/temp", it's treated as an absolute path, which won't work correctly.
    },
    //filename : how the files will be named
    filename: function (req, file, cb) {
      cb(null, file.originalname) //file.originalname → Keeps the original filename (e.g., profile.jpg stays as profile.jpg).
    }
  })
  
 export const upload = multer({ storage });
  
const multer = require("multer")

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, "/posts/" + uniqueSuffix + file.originalname)
  },
})

const uploadpost = multer({ storage: postStorage }).single("image")

const postImage = (req, res, next) => {
  uploadpost(req, res, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send("something went wrong while uploading file")
    }
    next()
  })
}

module.exports = {
  postImage,
}

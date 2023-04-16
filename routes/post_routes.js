const router = require("express").Router()
const {
  getPosts,
  createPost,
  getPost,
  deletePost,
} = require("../controller/post")
const {
  verifyUser,
  verifyAdmin,
  verifyTeacher,
} = require("../middleware/autthorization")
const { postImage } = require("../utlis/file_upload")

router
  .route("/")
  .get(verifyUser, getPosts)
  .post(verifyTeacher, postImage, createPost)
router.route("/:id").get(verifyUser, getPost).delete(verifyUser, deletePost)

module.exports = router

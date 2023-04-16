const router = require("express").Router()
const {
  getSubjects,
  createSubject,
  getSubject,
  deleteSubject,
} = require("../controller/subject")
const { verifyUser, verifyTeacher } = require("../middleware/autthorization")

router
  .route("/")
  .get(verifyUser, getSubjects)
  .post(verifyTeacher, createSubject)
router
  .route("/:id")
  .get(verifyUser, getSubject)
  .delete(verifyTeacher, deleteSubject)

module.exports = router

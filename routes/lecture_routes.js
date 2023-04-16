const router = require("express").Router()
const {
  getLectures,
  createLecture,
  getLecture,
  deleteLecture,
  updateLecture,
  addMember,
  removeMember,
  getMembers,
} = require("../controller/Lecture")
const { verifyUser, verifyTeacher } = require("../middleware/autthorization")

router
  .route("/")
  .get(verifyUser, getLectures)
  .post(verifyTeacher, createLecture)
router
  .route("/:id")
  .get(verifyUser, getLecture)
  .delete(verifyTeacher, deleteLecture)
  .put(verifyTeacher, updateLecture)

router
  .route("/:id/member")
  .post(verifyTeacher, addMember)
  .delete(verifyTeacher, removeMember)
  .get(verifyUser, getMembers)

module.exports = router

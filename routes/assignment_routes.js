const router = require("express").Router()
const {
  createAssignment,
  getAssignments,
  getAssignment,
  deleteAssignment,
  updateAssignment,
  submitAssigment,
  unSubmitAssignment,
} = require("../controller/assignment")
const { verifyUser, verifyTeacher } = require("../middleware/autthorization")

router
  .route("/")
  .get(verifyUser, getAssignments)
  .post(verifyTeacher, createAssignment)
router
  .route("/:id")
  .get(verifyUser, getAssignment)
  .delete(verifyTeacher, deleteAssignment)
  .put(verifyTeacher, updateAssignment)

router.route("/:id/submit").post(verifyTeacher, submitAssigment)

router.route("/:id/unsubmit").post(verifyTeacher, unSubmitAssignment)
// .get(verifyUser,)

module.exports = router

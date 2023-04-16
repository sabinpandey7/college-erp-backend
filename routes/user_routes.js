const router = require("express").Router()
const {
  getUsers,
  getUser,
  getSummary,
  updateUser,
  getUserAssignment,
  getUserAttendence,
  deleteUser,
} = require("../controller/user")
const {
  verifyUser,
  verifyTeacher,
  verifyAdmin,
} = require("../middleware/autthorization")

router.route("/").get(verifyUser, getUsers)
router.route("/summary").get(verifyUser, getSummary)
router
  .route("/:id")
  .get(verifyUser, getUser)
  .patch(verifyTeacher, updateUser)
  .delete(verifyAdmin, deleteUser)
router.route("/:id/assignment").get(verifyUser, getUserAssignment)
router.route("/:id/attendence").get(verifyUser, getUserAttendence)

module.exports = router

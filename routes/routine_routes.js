const router = require("express").Router()
const {
  getRoutines,
  createRoutine,
  getRoutine,
  deleteRoutine,
  addClass,
  removeClass,
  getClasses,
} = require("../controller/routine")
const { verifyUser, verifyTeacher } = require("../middleware/autthorization")

router
  .route("/")
  .get(verifyUser, getRoutines)
  .post(verifyTeacher, createRoutine)
router
  .route("/:id")
  .get(verifyUser, getRoutine)
  .delete(verifyTeacher, deleteRoutine)

router
  .route("/:id/schedule")
  .get(verifyUser, getClasses)
  .post(verifyUser, addClass)
  .delete(verifyTeacher, removeClass)

module.exports = router

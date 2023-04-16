const router = require("express").Router()
const {
  getPeriod,
  getPeriods,
  createPeriod,
  deletePeriod,
  markAttendence,
  unmarkAttendence,
  getAttendence,
} = require("../controller/period")
const { verifyTeacher } = require("../middleware/autthorization")

router
  .route("/")
  .post(verifyTeacher, createPeriod)
  .get(verifyTeacher, getPeriods)
router
  .route("/:id")
  .get(verifyTeacher, getPeriod)
  .delete(verifyTeacher, deletePeriod)

router
  .route("/:id/attendence")
  .get(verifyTeacher, getAttendence)
  .post(verifyTeacher, markAttendence)
  .delete(verifyTeacher, unmarkAttendence)

module.exports = router

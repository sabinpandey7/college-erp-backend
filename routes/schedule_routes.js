const { getSchedules } = require("../controller/schedules")
const { verifyUser } = require("../middleware/autthorization")

const router = require("express").Router()

router.route("/").get(verifyUser, getSchedules)

module.exports = router

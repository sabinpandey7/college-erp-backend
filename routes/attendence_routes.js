const router = require("express").Router()

const { getAttendence } = require("../controller/attendence")
const { verifyUser } = require("../middleware/autthorization")

router.get("/", verifyUser, getAttendence)

module.exports = router

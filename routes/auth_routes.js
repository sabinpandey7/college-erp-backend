const router = require("express").Router()
const { login, register } = require("../controller/auth")
const { verifyAdmin } = require("../middleware/autthorization")

router.post("/login", login)
router.post("/register", verifyAdmin, register)

module.exports = router

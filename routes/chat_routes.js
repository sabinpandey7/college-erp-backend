const router = require("express").Router()
const {
  getChats,
  createChat,
  getChat,
  deleteChat,
  updateChat,
  addMember,
  removeMember,
  getMembers,
  sendMessage,
  getMessages,
} = require("../controller/chat")
const { verifyUser, verifyTeacher } = require("../middleware/autthorization")

router.route("/").get(verifyUser, getChats).post(verifyTeacher, createChat)
router
  .route("/:id")
  .get(verifyUser, getChat)
  .delete(verifyTeacher, deleteChat)
  .put(verifyTeacher, updateChat)

router
  .route("/:id/member")
  .post(verifyTeacher, addMember)
  .delete(verifyTeacher, removeMember)
  .get(verifyUser, getMembers)

router
  .route("/:id/message")
  .post(verifyUser, sendMessage)
  .get(verifyUser, getMessages)

module.exports = router

const router=require("express").Router()
const { isAuthorized } = require("../Controllers/Authentication");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../Controllers/chatController");
router.route("/").post(isAuthorized ,accessChat).get(isAuthorized ,fetchChats)
router.route('/group').post(isAuthorized ,createGroupChat)
router.route('/rename').put(isAuthorized ,renameGroup)
router.route('/groupremove').put(isAuthorized ,removeFromGroup)
router.route('/groupadd').put(isAuthorized ,addToGroup)
module.exports=router

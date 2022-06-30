const router = require("express").Router();
const { isAuthorized } = require("../Controllers/Authentication");
const { sendMessage, allMessages } = require("../Controllers/messageController");
router.route("/").post(isAuthorized,sendMessage)
router.route("/:chatId").get(isAuthorized,allMessages)
module.exports=router
const router=require('express').Router()
const {
  regUser,
  loginUser,
  getAllUsers,
} = require("../Controllers/userController");
const {isAuthorized}=require("../Controllers/Authentication")
router.route("/").post(regUser).get(isAuthorized,getAllUsers)
router.route("/login").post(loginUser);
module.exports=router
const jwt=require("jsonwebtoken")
const asyncHandler=require("express-async-handler")
const User=require("../database/Models/userModel")
exports.isAuthorized = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(400)
      .send({ status: false, message: "please login first" });
  }
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return res
      .status(400)
      .send({ status: false, message: "Error in finding user" });
  }
  req.user = user;
  next();
});
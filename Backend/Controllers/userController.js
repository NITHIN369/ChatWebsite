const asyncHandler = require("express-async-handler");
const User = require("../database/Models/userModel");
const { getJWT } = require("../jwt");

const regUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  const rs = await User.findOne({ email });
  if (rs) {
    res.status(400);
    throw new Error("User already exists");
  }
  const currUser = new User({
    name,
    email,
    password,
    pic,
  });
  const saveResult = await currUser.save();
  if (saveResult) {
    const token = getJWT(saveResult._id);
    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .send({ user: currUser, token });
  } else {
    res.status(400);
    throw new Error("Unable to create User");
  }
});
exports.regUser = regUser;
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter required fields");
  }
  const r = await User.findOne({ email });
  if (!r) {
    res.status(400);
    throw new Error("Their is no User with that Mail");
  }
  cmpres = await r.ComparePassword(password);
  if (cmpres) {
    const token = getJWT(r._id);
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .send({ user: r, token });
  } else {
    res.status(400);
    throw new Error("Invalid Password");
  }
});
exports.getAllUsers=asyncHandler(async(req,res)=>{
    console.log("INside get alluser")
    const keyword=req.query.search?
    {$or:[{name:{$regex:req.query.search,$options:"i"}},{email:{$regex:req.query.search,$options:"i"}}]}
    :
    {}
    const users=await User.find(keyword)
    .find({$ne:{_id:req.user._id}})
    res.send(users).status(200)
})
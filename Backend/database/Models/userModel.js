const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);
userSchema.methods.ComparePassword=async function(pass){
  return await bcrypt.compare(pass,this.password);
}
userSchema.pre("save",async function (next){
  if(!this.isModified("password")){
    next()
  }
  const salt=await bcrypt.genSalt(10)
  this.password=await bcrypt.hash(this.password,salt)
})
const User = mongoose.model("User", userSchema);
module.exports = User;
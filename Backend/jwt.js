const jwt=require("jsonwebtoken")
const getJWT=(id)=>{
    console.log("Inside getjwt: ",id)
    return jwt.sign({id}, process.env.JWT_KEY,{
        expiresIn:"30d"
    });
}
exports.getJWT=getJWT
const express = require("express");
const app = express();
const {chat} = require("./data/data");
require("dotenv").config();
const conn=require("./database/Config/Config")
const userRouter=require("./Routers/userRouter")
const chatRouter = require("./Routers/chatRouter");
const cookieParser=require("cookie-parser")
const messageRouter = require("./Routers/messageRouter");
const PORT = process.env.PORT || 5000;
app.use(express.json())
app.use(cookieParser())
app.get("/",(req,res)=>{
  res.status(200).send("API is running successfully")
})
app.use("/api/user",userRouter)
app.use("/api/chat",chatRouter)
app.use("/api/message",messageRouter)
const server=app.listen(PORT, () => {
  console.log("Started listening at PORT: ", PORT);
});
const io = require("socket.io")(server, {
  pageTimeOut: 6000, //it will wait for given time if user didnt send any message within that time then it will close connection to save bandwidth
  cors: {
    origin: "http://localhost:3000", //to avoid cors errors
  },
});
io.on("connection",(socket)=>{ // io.on is turning on connection
    console.log("Connected to socket.io: ") 
    socket.on("setup",(userData)=>{
      socket.join(userData._id)//it will create room for particular user
      socket.emit("connected")
    })
    socket.on("join chat",(room)=>{
      socket.join(room);
      console.log("user joined room: ",room)
    })
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat; 
      if (!chat.users) return console.log("chat.users not defined");
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
})
const mongoose=require("mongoose")
mongoose.connect(process.env.ATLAS_URI,(err)=>{
    if(err){
        console.log(err)
    }
});
const connection=mongoose.connection
connection.once("open",()=>{
    console.log("connected to dataabse ")
}
)

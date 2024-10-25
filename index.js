const express = require("express")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/courses");
JWT_SECRET = "course";
const app = express()
app.use(express.json())
 
app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/course",courseRouter)
 

async function main(){
    await mongoose.connect("mongodb+srv://max:max1234@cluster0.agf2p.mongodb.net/coursera-app")
    app.listen(3000)
    console.log("server started")

}

main()
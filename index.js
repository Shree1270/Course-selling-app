const express = require("express")
require('dotenv').config()
const mongoose = require("mongoose")
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/courses");
const app = express()
app.use(express.json())
 
app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter) 
app.use("/api/v1/course",courseRouter)
 

async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000)
    console.log("server started")

}

main()

const { Router } = require("express")
const bcrypt = require("bcrypt")
import { z } from "zod";
const jwt = require("jsonwebtoken")
const { JWT_USER_PASSWORD } = require("../config")
const { userModel, purchaseModel, courseModel } = require("../db")
const { userAuth } = require("../middlewares/user")
const userRouter = Router();

userRouter.post("/signup", async(req,res)=>{ 

    //creating validation  
    const userValidate =  z.object({
        firstName : z.string().min(5).max(50),
        lastName :  z.string().min(5).max(50),
        email : z.string().min(5).max(50).email(),
        password : z.string().min(5).max(50)
        .refine((password)=> /A-Z/.test(password),{ msg:"require atleast one uppercase" })
        .refine((password) => /a-z/.test(password),{ msg:"require atleast one lowercase" })
        .refine((password) => /!@#$%&*_/.test(password),{ msg:"require atleast one special character" })
    }).strict()

    const parse = userValidate.safeParse(); //Parseing the object
    if(!parse.success){
        res.status(401).json({
            msg:"something is wrong"
        })
        return
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

try{
    // Hashing password
    const hashedPassword = await bcrypt.hash(password,5)

    await userModel.create({
        firstName : firstName,
        lastName  : lastName,
        email     : email,
        password  : hashedPassword
    })
} catch(e){
    res.json({
        msg : "Your signup failed"
    })
}

    res.status(200).json({
        msg:"You have successfully signup"
    })

    
})

userRouter.post("/login", async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    // Finding user by email
    const user = await userModel.findOne({
        email : email
    })

     //comparing the hash password 
   const match = await bcrypt.compare(password, user.password)

   if(match){
    const token = jwt.sign({
        id : user._id
    },JWT_USER_PASSWORD)
   }else{
    res.json({
       token // assigning user Token
    })
   }

   res.json({
    msg:"Incorrect credientals"
   })
    
})

userRouter.get("/purchases",userAuth, async(req,res)=>{
    userId = req.userId;
    const purchases = await purchaseModel.find({
        userId
    })

    const courseData = await courseModel.findById({
        _id : { $in : purchases.map(x => x.courseId)} //Finding buyed courses of the user
    })

    res.json({
        purchases,
        courseData
    })

})

module.exports = {
    userRouter:userRouter
}
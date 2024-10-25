const { Router } = require("express")
const bcrypt = require("bcrypt")
import { z } from "zod";
const jwt = require("jsonwebtoken")
JWT_SECRET = "course";
const { userModel } = require("../db")
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

    const parse = userValidate.safeParse();
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

    const find = await userModel.find({
        email : email
    })

   const match = await bcrypt.compare(password, find.password)

   if(match){
    const token = jwt.sign({
        Id : find._id
    },JWT_secret)
   }else{
    res.json({
        msg:"Incorrect crediantels"
    })
   }

   res.json({
    msg:"You have successfully login"
   })
    
})

userRouter.get("/purchases", (req,res)=>{

})

module.exports = {
    userRouter:userRouter
}
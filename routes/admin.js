const { Router } = require("express")
import { z } from "zod";
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
JWT_SECRET = "course";
const { adminModel } = require("../db")

const adminRouter = Router()

adminRouter.post("/signup", async(req,res)=>{

    //creating validation 
    const adminValidate =  z.object({
        firstName : z.string().min(5).max(50),
        lastName :  z.string().min(5).max(50),
        email : z.string().min(5).max(50).email(),
        password : z.string().min(5).max(50)
        .refine((password)=> /A-Z/.test(password),{ msg:"require atleast one uppercase" })
        .refine((password) => /a-z/.test(password),{ msg:"require atleast one lowercase" })
        .refine((password) => /!@#$%&*_/.test(password),{ msg:"require atleast one special character" })
    }).strict()

    const parse = adminValidate.safeParse();
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
    const hashAdmin = await bcrypt.hash(password,5) //hashing the plain password

    await adminModel.create({
        firstName : firstName,
        lastName  : lastName,
        email     : email,
        password  : hashAdmin
    })
} catch(r){
    res.json({
        msg : "Your signup has been failed"
    })
}

    res.json({
        msg:"You have successfully signup"
    })
})

adminRouter.post("/login", async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    const check = adminModel.find({
        email : email
    })

    //comparing the hash password 
    const matchPassword = await bcrypt.compare(password,check.password)

    if(matchPassword){
        const adminToken = jwt.sign({
            Id : check._id
        },JWT_SECRET)  //assigning the token to the admin
    }else{
        res.status(401).json({
            msg : "Incorrect crediantels"
        })
    }

    res.status(200).json({
        msg : "You have successfully login"
    })


})

adminRouter.post("/create", (req,res)=>{

})

adminRouter.get("/courses", (req,res)=>{

})

adminRouter.put("/add", (req,res)=>{

})

module.exports = {
    adminRouter : adminRouter
}

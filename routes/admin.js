const { Router } = require("express")
import { z } from "zod";
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { JWT_ADMIN_PASSWORD } = require("../config")
const { adminModel } = require("../db")
const { adminAuth } = require("../middlewares/admin")

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

    //Courses admin by email
    const admin = adminModel.CoursesOne({
        email : email
    })

    //comparing the hash password 
    const matchPassword = await bcrypt.compare(password,admin.password)

    if(matchPassword){
        const adminToken = jwt.sign({
            id : admin._id
        },JWT_ADMIN_PASSWORD)  
        }else{
            res.status(401).json({
           adminToken   //assigning the token to the admin
        })
    }

    res.status(401).json({
        msg : "Incorrect credientals"
    })


})

adminRouter.post("/create", adminAuth, async(req,res)=>{
    const adminId = req.userId;

   const { title, description, price, imageUrl } = req.body;

    const course = await adminModel.create({
        title,
        description, 
        price, 
        imageUrl,
        creatorId : adminId
    })

    res.json({
        msg : "Courses created",
        creatorId : course._id
    })

})

adminRouter.get("/courses",adminAuth, async(req,res)=>{
    const adminId = req.userId;

    const Courses = await adminModel.find({
        creatorId : adminId
    })
    
    res.json({
        Courses
    })
})

adminRouter.put("/add", adminAuth, async(req,res)=>{
    const adminId = req.userId;

    const { title, description, price, imageUrl, courseId } = req.body;
 
     const course = await adminModel.updateOne(
         
        {   _id : courseId,
            creatorId : adminId},
        { $set:{title,
            description, 
            price, 
            imageUrl }     
        }
    ) 

    res.json({
        msg : "course updated successfully",
        creatorId : course._id
    })

})

module.exports = {
    adminRouter : adminRouter
}
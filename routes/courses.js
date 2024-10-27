const { Router } = require("express")
const { userAuth } = require("../middlewares/user");
const { courseModel, purchaseModel } = require("../db");

const courseRouter = Router()

courseRouter.post("/buy", userAuth, async(req,res)=>{

    userId = req.userId;
    courseId = req.body.courseId;

    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        msg : "You have purchased course"
    })
 
}) 
 
courseRouter.get("/preview", async(req,res)=>{ 

    const courses = await courseModel.find({})

    res.json({
        courses
    })

})

module.exports = {
    courseRouter:courseRouter
}
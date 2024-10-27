const jwt = require("jsonwebtoken")
JWT_SECRET = "course";


function userAuth(req,res,next){
    const token = req.headers.authorization;
    if(token){
        const decodedToken = jwt.verify(token,JWT_SECRET);
        req.userId = decodedToken.id;
        next()
    }else{
        res.status(401).json({
            msg:"Invalid crediantels"
        })
    }
}

function adminAuth(req,res,next){
    const token = req.headers.authorization;
    if(token){
        const decodedToken = jwt.verify(token,JWT_SECRET);
        req.userId = decodedToken.id;
        next()
    }else{
        res.status(401).json({
            msg:"Invalid crediantels"
        })
    }
}

module.exports = {
    userAuth,
    adminAuth
}

const jwt = require("jsonwebtoken")
const { JWT_USER_PASSWORD } = require("./config");


function userAuth(req,res,next){
    const token = req.headers.authorization;
    if(token){
        const decodedToken = jwt.verify(token,JWT_USER_PASSWORD);
        req.userId = decodedToken.id;
        next()
    }else{
        res.status(401).json({
            msg:"Invalid crediantels"
        })
    }
}

module.exports = {
    userAuth
}
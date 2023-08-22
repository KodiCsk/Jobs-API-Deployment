const jwt=require('jsonwebtoken')
const { UnauthenticatedError }=require('../errors')
const user=require('../models/User')

const auth=(req,res,next)=>{
    
    const authHeader=req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication failed:Not a valid token')
    }

    token=authHeader.split(' ')[1]

    try {
        const payload=jwt.verify(token,process.env.JWT_SECRET)
        //attach the user to job routes

        /*we can also fetch userID from DB
        const userID=user.findByID(payload.userID).select('-password')
        req.user=user

        This is an extra step because we can already verified user through authentication middleware(in this module only)
        while verifying token*/
        req.user={userID:payload.userID,name:payload.name}
        next()
    } catch (error) {
        console.log(
            error
        )
        throw new UnauthenticatedError('Authentication failed:Not a valid token')
    }
}


module.exports=auth
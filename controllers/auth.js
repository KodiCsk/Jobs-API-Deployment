const user=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const { BadRequestError, UnauthenticatedError }=require('../errors')
const jwt=require('jsonwebtoken')

const register=async (req,res)=>{
    
    const createUser=await user.create({...req.body})
    const token=createUser.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:createUser.getName()},token})
}

const login=async (req,res)=>{
    const { email,password }=req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const checkuser=await user.findOne({email})
    if(!checkuser){
        throw new UnauthenticatedError('Please enter valid email')
    }
    //console.log(checkuser);
    const isPasswordCorrect=await checkuser.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Please enter valid password')
    }
    //console.log("token")
    const token=checkuser.createJWT()
   // console.log("token")
    res.status(StatusCodes.OK).json({user:{name:checkuser.getName()},token})
}

module.exports={
    register,login
}
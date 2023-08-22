const mongoose=require('mongoose')
const bcryptjs=require('bcryptjs')
const JWT=require('jsonwebtoken')
require('dotenv').config()

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        minLength:3,
        maxLength:50
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please enter a valid email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minLength:6
    },
})

userSchema.pre('save',async function(){
    const salt=await bcryptjs.genSalt(10)
    this.password=await bcryptjs.hash(this.password,salt)

})

userSchema.methods.createJWT=function(){
    //console.log('inside model');
    return JWT.sign(
        {
            userID:this._id,name:this.name
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_LIFETIME
        })
}
userSchema.methods.getName=function (){
    return this.name
}

userSchema.methods.comparePassword=async function (givenPassword){
    const isMatch=await bcryptjs.compare(givenPassword,this.password)
    return isMatch
}
module.exports=mongoose.model('Users',userSchema)
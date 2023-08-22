const mongoose=require('mongoose')

const jobSchema=mongoose.Schema({
    company:{
        type:String,
        name:[true,'Please provide Company name'],
        maxLength:50
    },
    position:{
        type:String,
        name:[true,'Please provide position name'],
        maxLength:100
    },
    status:{
        type:String,
        enum:['interview','declined','pending']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:[true,'Please provide user']
    }
},{timestamps:true})

module.exports=mongoose.model('Jobs',jobSchema)
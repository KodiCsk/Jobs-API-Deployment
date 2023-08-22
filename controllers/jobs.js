const { StatusCodes } = require('http-status-codes')
const jobs=require('../models/Job')
const { NotFoundError,BadRequestError }=require('../errors')

const getAllJobs=async (req,res)=>{
    const allJobs=await jobs.find({createdBy:req.user.userID}).sort('createdAt')
    res.status(StatusCodes.OK).json({allJobs,count:allJobs.length})
}

const getJob=async (req,res)=>{

    const {
        user:{ userID },
        params:{id:jobID }
    }=req

    const job=await jobs.findOne({
        _id:jobID,
        createdBy:userID
    })
    
    if(!job){
        throw new NotFoundError('No jobs with this ID')
    }

    res.status(StatusCodes.OK).json({job})

}

const createJob=async (req,res)=>{
    // console.log(req.user)
    // console.log(req.body)
    req.body.createdBy=req.user.userID
    const job=await jobs.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob=async (req,res)=>{

    const {
        user:{userID},
        params:{ id: JobID },
        body:{ company,position}
    }=req

    //console.log(req.body,req.params)

    if(company==='' || position===''){
        throw new BadRequestError('Company and position fields cannto be empty')
    }

    const job=await jobs.findOneAndUpdate(
        {_id:JobID,createdBy:userID },
        req.body,
        {new:true,runValidators:true})

    if(!job){
        throw new NotFoundError(`No job with ID : ${JobID}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob=async (req,res)=>{
    const {
        user:{userID},
        params:{ id: JobID },
        body:{ company,position}
    }=req

    //.log(req.body,req.params)

    if(company==='' || position===''){
        throw new BadRequestError('Company and position fields cannto be empty')
    }

    const job=await jobs.findByIdAndRemove(
        {_id:JobID,
            createdBy:userID })

    if(!job){
        throw new NotFoundError(`No job with ID : ${JobID}`)
    }
    res.status(StatusCodes.OK).json({job})
}


module.exports={
    getAllJobs,getJob,createJob,updateJob,deleteJob
}

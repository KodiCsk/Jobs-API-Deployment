const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    statusCode:err.statusCode||StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message|| 'Something went wrong. Please try again'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if(err.name=='ValidationError'){
    customError.msg=Object.values(err.errors).map((item)=>item.message).join(',')
    customError.statusCode=400
  }

  if(err.name=='CastError'){
    customError.msg=`No Job present with id: ${err.value}`
    customError.statusCode=400
  }


  if(err.code || err.code==11000){
    //duplicateEmail=err.keyValue
    customError.msg=`Duplicate value for email ${Object.values(err.keyValue)} .Please choose another email ` 
    customError.statusCode=400
  }
  return res.status(customError.statusCode).json({ msg:customError.msg })
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
}

module.exports = errorHandlerMiddleware

import mongoose from "mongoose";

export default (err,req,res,next)=>{
  if(err instanceof mongoose.Error.ValidationError) {
    return res.status(err.code || 400).json({
      status: false,
      message: err.message || "Validation Error",
      errors: Object.keys(err.errors).map(
        (key)=> err.errors[key].message
      )
    })
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(err.code || 400).json({
        status: false,
        message: "Invalid ID Format",
    });
  }

  if (err.code === 11000) {
    // Duplicate key error
    return res.status(409).json({
        status: false,
        message: "Duplicate Key Error",
        details: err.keyValue,
    });
 }

 if (err.isOperational) {
  return res.status(err.statusCode || 400).json({
      status: false,
      message: err.message,
  });
}

else {
  return res.status( err.statusCode ||500).json({
      status: false,
      message: err.message || "Internal Server Error",
  });
}

}
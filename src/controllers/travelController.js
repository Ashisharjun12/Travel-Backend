import createHttpError from "http-errors";
import usermodel from "../models/userModel.js";
import travelmodel from "../models/traveModel.js";
import { redis } from "../config/redis.js";


const travelDetails = async (req, res, next) => {
  const data = req.body;

 



  if (!data) {
    return next(createHttpError(400, "Travel details are required"));
  }

  try {
    
    const user = await usermodel.findById(req.user?._id);

    if (!user) {
      return next(createHttpError(400, "user not found..."));
    }

    const newTravel =  new travelmodel(data);
    await newTravel.save();

    if (!user.travellerDetails) {
        user.travellerDetails = []; 
      }
    
    
    user.travellerDetails.push(newTravel); 
    await user.save();

    redis.set(req.user?._id, JSON.stringify(user));

    res.status(200).json({
      success:true,
      message:"pushing travel details..",
      newTravel,
      
    })
   

  } catch (error) {
    return next(createHttpError(400, "error in travel details...",error ));
  }
};


const getTravelDetails = async (req,res,next)=>{
  try {
    const user = await usermodel.findById(req.user?._id).populate('travellerDetails');
    
    if (!user) {
      return next(createHttpError(400, "User not found"));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(createHttpError(400, "Error in retrieving user details", error));
  }


}

export { travelDetails ,getTravelDetails};




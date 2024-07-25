import createHttpError from "http-errors";
import { chatSession } from "../AiModel/aimodel.js";
import { redis } from "../config/redis.js";
import travelModel from "../models/traveModel.js";
import usermodel from "../models/userModel.js";


const travelDetails = async (req, res, next) => {

  const { FINAL_PROMPT } = req.body;
  console.log("final prompt:", FINAL_PROMPT);

  if (!FINAL_PROMPT) {
    return next(createHttpError(400, "Invalid final prompt..."));
  }

  try {
    // Generate AI response using prompt
    const result = await chatSession.sendMessage(FINAL_PROMPT);

    // Get AI response text
    const aiResponseText = await result.response.text();

    // Log AI response text for debugging
    console.log("AI Response Text:", aiResponseText);

    // Parse the AI response
    let aiResponse;
    try {
      aiResponse = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return next(createHttpError(500, "Invalid AI response format."));
    }

    console.log("AI Response:", aiResponse);

    // Save the generated travel data to the database
    const user = await usermodel.findById(req.user?._id);

    if (!user) {
      return next(createHttpError(400, "User not found..."));
    }

    const newTravel = new travelModel(aiResponse);
    await newTravel.save();

    if (!user.travellerDetails) {
      user.travellerDetails = [];
    }

    user.travellerDetails.push(newTravel);
    user.tripsBuiltCount += 1; 
    await user.save();

    redis.set(req.user?._id, JSON.stringify(user));

    res.status(200).json({
      success: true,
      message: "Trip built using AI successfully...",
      aiResponse,
    });

  } catch (error) {
    console.error("Error generating AI response:", error);
    return next(createHttpError(500, "Failed to generate AI response."));
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



export { travelDetails ,getTravelDetails };




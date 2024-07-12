import createHttpError from "http-errors";
import createActivationToken from "../helpers/activationToken.js";
import emailHelper from "../utils/EmailHelper.js";
import jwt from "jsonwebtoken";
import usermodel from "../models/userModel.js";
import { _config } from "../config/config.js";
import cookieToken from "../utils/cookieToken.js";
import { redis } from "../config/redis.js";

const registerUser = async (req, res, next) => {
  try {
    //get data from frontend
    const { fullname, email, password } = req.body;

    if (!email || !fullname || !password) {
      return next(createHttpError(400, "All fields are required."));
    }

    const user = {
      fullname,
      email,
      password,
    };

    //get activation token
    const activationToken = createActivationToken(user);

    //get code
    const activationCode = activationToken.activationCode;

    //extract  data before send code
    const data = { user: { name: user.fullname }, activationCode };

    //call emailhelper
    try {
      await emailHelper({
        email: user.email,
        subject: "Activate Your Account",
        template: "activationMail.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email ${user.email} to verify account.`,
        activationToken: activationToken.token,
      });
    } catch (error) {
      return next(
        createHttpError(401, "Error while sending activation email", error)
      );
    }
  } catch (error) {
    return next(
      createHttpError(400, "error while sending activation email", error)
    );
  }
};

const activateuser = async (req, res, next) => {
  try {
    const { activation_code, activation_token } = req.body;

    const newUser = jwt.verify(activation_token, _config.ACTIVATION_SECRET);

    //check code
    if (String(newUser.activationCode) !== String(activation_code)) {
      return next(createHttpError(400, "invalid activation code"));
    }

    const { fullname, email, password } = newUser.user;

    //check user exist by email
    const existUser = await usermodel.findOne({ email });

    if (existUser) {
      return next(createHttpError(401, "user already exist with this email"));
    }

    const user = await usermodel.create({
      fullname,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Activating user...",
      user,
    });
  } catch (error) {
    return next(createHttpError(400, "error while activating user", error));
  }
};


const loginUser = async(req,res,next)=>{
     //get frontend data
     const { email, password } = req.body;

     if (!email || !password) {
        return next(createHttpError(400, "all fields required.."));
      }
  
      //find by email and check
      const user = await usermodel.findOne({ email }).select("+password");
  
      if (!user) {
        return next(createHttpError(400, " user not exist with this email.."));
      }

        //checck password
    const isPasswordMatch = await user.isValidatedPassword(password);

    if (!isPasswordMatch) {
      return next(createHttpError(400, "invalid email or password.."));
    }

    //send cookie
    cookieToken(user, res, 200);


}

const logout = async(req,res,next)=>{
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
    
        //delete from redis db
        const userId = req.user?._id || "";
    
        console.log(req.user?._id);
    
        redis.del(userId);
    
        res.status(200).json({
          success: true,
          message: "logout successfully..",
        });
      } catch (error) {
        return next(createHttpError(400, "logout error..."));
      }


}


const updatePassword = async(req,res,next)=>{
   try {
     const { oldPassword, newPassword } = req.body;
 
     if(!oldPassword || !newPassword){
         return next(createHttpError(400 , "please fill old and new password"))
       }
 
       const user = await usermodel.findById(req.user?._id).select("+password");
   
     if (user.password == undefined) {
       return next(400, "invalid user");


     }

     const isMatchPassword = await user?.isValidatedPassword(oldPassword);
 
     if (!isMatchPassword) {
         return next(createHttpError(400, "invalid password.."));
       }
     
       user.password = newPassword;
     
       await user.save();
   
       await redis.set(req.user?._id , JSON.stringify(user))
     
       res.status(200).json({
         success:true,
         message:"updating password successfully..",
         user
       })
   } catch (error) {
     return next(createHttpError(400, "error while updating password...", error));
    
   }

}

export { registerUser, activateuser ,loginUser,logout, updatePassword};

import createHttpError from "http-errors";
import createActivationToken from "../helpers/activationToken.js";
import emailHelper from "../utils/EmailHelper.js";
import jwt from "jsonwebtoken";
import usermodel from "../models/userModel.js";
import { _config } from "../config/config.js";
import cookieToken from "../utils/cookieToken.js";
import { redis } from "../config/redis.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { nanoid } from "nanoid";

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
      isVerified:true
    });

     
    //send cookie
  cookieToken(user, res, 200);
  } catch (error) {
    return next(createHttpError(400, "error while activating user", error));
  }
};

const loginUser = async (req, res, next) => {
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
};

const logout = async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    //delete from redis db
    const userId = req.user?._id || "";

  

    redis.del(userId);

    res.status(200).json({
      success: true,
      message: "logout successfully..",
    });
  } catch (error) {
    return next(createHttpError(400, "logout error..."));
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(createHttpError(400, "please fill old and new password"));
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

    await redis.set(req.user?._id, JSON.stringify(user));

    res.status(200).json({
      success: true,
      message: "updating password successfully...",
      user,
    });
  } catch (error) {
    return next(
      createHttpError(400, "error while updating password...", error)
    );
  }
};

const updateDetails = async (req, res, next) => {

  const userId = req.user?._id;

  const {fullname} = req.body;

  if(!fullname){
    return next(createHttpError(400 , "please enter fullname"))
  }

  const user = await usermodel.findByIdAndUpdate(userId, {fullname}, {new: true});

  if(!user){
    return next(createHttpError(400, "user not found"))
  }


  //update in redis
  await redis.set(userId, JSON.stringify(user));


  res.status(200).json({
    success: true,
    message: "updating details successfully...",
    user,
  });




};

const updateavatar = async (req, res, next) => {
  try {
    const userid = req.user?._id;

    let localavatarpath;
    if (req.files && req.files.avatar) {
      localavatarpath = req.files.avatar[0].path;
    }

    let user;
    if (localavatarpath) {
      user = await usermodel.findById(userid);

      if (!user) {
        return next(createHttpError(400, "User does not exist"));
      }
      // If user already has an avatar uploaded
      if (user.avatar && user.avatar.id) {
        await deleteOnCloudinary(user.avatar.id);
      }

      // Upload new avatar
      const avatarupload = await uploadOnCloudinary(
        localavatarpath,
        "avatarfolder"
      );

      // Update user avatar
      user.avatar = {
        id: avatarupload.public_id,
        secure_url: avatarupload.secure_url,
      };

      await user.save();

      //set data to redis db
      await redis.set(userid, JSON.stringify(user));
    } else {
      user = await usermodel.findById(userid);
      if (!user) {
        return next(createHttpError(400, "User does not exist"));
      }
    }

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    return next(createHttpError(400, "Error while updating avatar", error));
  }
};

const resetPassword = async (req, res, next) => {
  
  try {
    const { email } = req.body;
    

    if (!email) {
      return next(createHttpError(400, "Please provide the email..."));
    }

    //find by email in db
    const user = await usermodel.findOne({email})


    if(!user){
      return next(createHttpError(400 , "email not find in db..."))
    }

      // Generate a new password
      const newpassword = nanoid(8);
    user.password = newpassword;

    await user.save();

   


    // Send email
    try {
      await emailHelper({
        email,
        subject: "Reset your Password",
        template: "resetPassword.ejs",
        data: { newpassword },
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (error) {
      return next(
        createHttpError(401, "Error while sending reset password email", error)
      );
    }
  } catch (error) {
    return next(
      createHttpError(400, "Error while sending activation email", error)
    );
  }


};


const getUserDetails = async (req,res,next)=>{
 try {
   const userId = req.user?._id;
 
 
 
   const user = await usermodel.findById(userId)
 
   if(!user){
     return next(createHttpError(400, "user not found"))  
   }
 
   res.status(200).json({success:true , user})
 } catch (error) {
   return next(createHttpError(400, "error while getting user details", error))
  
 }




}




export {
  registerUser,
  activateuser,
  loginUser,
  logout,
  updatePassword,
  updateDetails,
  updateavatar,
  resetPassword,
  getUserDetails
 
};

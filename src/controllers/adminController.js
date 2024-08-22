import createHttpError from "http-errors";
import usermodel from "../models/userModel.js";
import { redis } from "../config/redis.js";
import cookieToken from "../utils/cookieToken.js";
import { deleteOnCloudinary } from "../utils/cloudinary.js";

const adminlogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createHttpError(400, "All fields are required."));
    }

    // Find user by email and check
    const user = await usermodel.findOne({ email }).select("+password");

    if (!user) {
      return next(createHttpError(400, "User not found with this email."));
    }

    if (user.role !== "admin") {
      return next(createHttpError(403, "User is not an admin."));
    }

    // Check password
    const isPasswordMatch = await user.isValidatedPassword(password);
    if (!isPasswordMatch) {
      return next(createHttpError(400, "Invalid email or password."));
    }

    // Send cookie
    cookieToken(user, res, 200);
  } catch (error) {
    next(createHttpError(500, "Error during admin login.", error));
  }
};

const admingetAllUsers = async (req, res, next) => {
  const user = await usermodel.find();

  if (!user) {
    return next(createHttpError(400, "user not found...."));
  }

  res.json({ success: true, message: "all users found sucessfully....", user });
};

const setrole = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const { role } = req.body;

    if (!userId || !role) {
      return next(createHttpError(400, "User ID and role are required."));
    }

    const user = await usermodel.findById(userId);

    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully.",
      user,
    });
  } catch (error) {
    next(createHttpError(500, "Error updating user role.", error));
  }
};

const admingetoneuser = async (req, res, next) => {
  const userid = req.params.id;

  const user = await usermodel.findById(userid);

  if (!user) {
    return next(createHttpError(404, "User not found."));
  }

  res.json({ success: true, message: "User found successfully....", user });
};


const admindeleteOneUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await usermodel.findById(userId);

    if (!user) {
      return next(createHttpError(404, "user not found"));
    }

    //delete from cloudinary..
    if (user.avatar && user.avatar.id) {
      await deleteOnCloudinary(user.avatar.id);
    }

    //remove user from db
    await usermodel.findByIdAndDelete(userId);

    //update and delete redis db
    redis.del(userId);

    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    return next(
      createHttpError(500, "error while deleting user...", error.message, error)
    );
  }
};




export {
  admingetAllUsers,
  adminlogin,
  setrole,
  admingetoneuser,
  admindeleteOneUser,
};

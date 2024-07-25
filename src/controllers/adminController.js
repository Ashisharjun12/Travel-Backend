import createHttpError from "http-errors";
import usermodel from "../models/userModel.js";
import { redis } from "../config/redis.js";
import cookieToken from "../utils/cookieToken.js";

const adminlogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createHttpError(400, "All fields are required."));
    }

    // Find user by email and check
    const user = await usermodel.findOne({ email }).select("+password");
    console.log("User found:", user);

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
  try {
    const { role } = req.params;
    const { changerole } = req.body;

    // Validate inputs
    if (!changerole) {
      return next(createHttpError(400, "New role is required."));
    }

    // Find user by ID and update their role
    const user = await usermodel.findByIdAndUpdate(
      role,
      { role: changerole },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    // Update user info in Redis
    await redis.set(user._id.toString(), JSON.stringify(user));

    res.json({
      success: true,
      message: "Role updated successfully",
      user,
    });
  } catch (error) {
    next(createHttpError(500, "Error updating role.", error));
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

export { admingetAllUsers, adminlogin, setrole, admingetoneuser };

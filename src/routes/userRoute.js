import { Router } from "express";
import {
  activateuser,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updateavatar,
  updateDetails,
  updatePassword,
} from "../controllers/userController.js";
import isLoggedIn from "../middlewares/Auth.js";
import { upload } from "../middlewares/multer.js";

const userRoute = Router();

userRoute.post("/register", registerUser);
userRoute.post("/activate", activateuser);
userRoute.post("/login", loginUser);
userRoute.post("/logout", isLoggedIn, logout);
userRoute.put("/updatePassword", isLoggedIn, updatePassword);
userRoute.put('/resetPassword', resetPassword)
userRoute.put("/updateDetails", isLoggedIn, updateDetails);
userRoute.post(
  "/updateavatar",
  isLoggedIn,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    }
  ]),
  updateavatar
);

export default userRoute;

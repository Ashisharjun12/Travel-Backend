import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";
import { _config } from "../config/config.js";
import usermodel from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
    try {
       
    
        if (!req.user || !req.user.email) {
          return next(createHttpError(401, "Unauthorized"));
        }
    
        const email = req.user.email;
        const user = await usermodel.findOne({ email });
        console.log("User from DB:", user);
    
        if (!user) {
          return next(createHttpError(401, "Unauthorized"));
        }
    
        if (user.role !== "admin") {
          return next(createHttpError(403, "Forbidden, you are not allowed to access this."));
        }
    
        next();
      } catch (error) {
        next(createHttpError(500, "auth middleware error", error));
      }
};

export default isAdmin;

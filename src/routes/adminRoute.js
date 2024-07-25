import { Router } from "express";
import { admingetAllUsers, admingetoneuser, adminlogin, setrole } from "../controllers/adminController.js";
import customrole from "../middlewares/customRole.js";
import isLoggedIn from "../middlewares/Auth.js";
import isAdmin from "../middlewares/isAdmin.js";

const adminRoute = Router();

//define routes
adminRoute.post('/login', adminlogin)
adminRoute.post('changerole/:role', isLoggedIn , isAdmin,setrole)
adminRoute.get("/allUser", isLoggedIn, isAdmin,customrole("admin"), admingetAllUsers);
adminRoute.post('/getoneuser/:id', isLoggedIn, isAdmin , customrole('admin') , admingetoneuser)

export default adminRoute;

import { Router } from "express";
import {  admindeleteOneUser, admingetAllUsers, admingetoneuser, adminlogin,  setrole } from "../controllers/adminController.js";
import customrole from "../middlewares/customRole.js";
import isLoggedIn from "../middlewares/Auth.js";
import isAdmin from "../middlewares/isAdmin.js";

const adminRoute = Router();

//define routes
adminRoute.post('/login', adminlogin)
adminRoute.post('/changerole/:id', isLoggedIn , isAdmin, customrole("admin"),setrole)
adminRoute.get("/allUser", isLoggedIn, isAdmin,customrole("admin"), admingetAllUsers);
adminRoute.get('/getoneuser/:id', isLoggedIn, isAdmin , customrole('admin') , admingetoneuser)
adminRoute.post('/delete/:id' , isLoggedIn ,isAdmin , customrole('admin') , admindeleteOneUser)

export default adminRoute;

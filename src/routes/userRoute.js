import {Router} from 'express'
import { activateuser, loginUser, logout, registerUser, updatePassword } from '../controllers/userController.js';
import isLoggedIn from '../middlewares/Auth.js';




const userRoute = Router()

userRoute.post('/register', registerUser)
userRoute.post('/activate',activateuser)
userRoute.post('/login',loginUser)
userRoute.post('/logout',isLoggedIn, logout)
userRoute.put('/updatePassword',isLoggedIn, updatePassword)






export default userRoute;
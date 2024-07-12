import {Router} from 'express'
import { activateuser, loginUser, logout, registerUser } from '../controllers/userController.js';



const userRoute = Router()

userRoute.post('/register', registerUser)
userRoute.post('/activate',activateuser)
userRoute.post('/login',loginUser)
userRoute.post('/logout', logout)





export default userRoute;
import {Router} from 'express'
import { activateuser, loginUser, logout, registerUser, updatePassword } from '../controllers/userController.js';



const userRoute = Router()

userRoute.post('/register', registerUser)
userRoute.post('/activate',activateuser)
userRoute.post('/login',loginUser)
userRoute.post('/logout', logout)
userRoute.post('/updatePassword', updatePassword)





export default userRoute;
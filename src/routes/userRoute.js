import {Router} from 'express'
import { activateuser, loginUser, registerUser } from '../controllers/userController.js';



const userRoute = Router()

userRoute.post('/register', registerUser)
userRoute.post('/activate',activateuser)
userRoute.post('/login',loginUser)





export default userRoute;
import { Router} from "express"
import isLoggedIn from "../middlewares/Auth.js";
import { travelDetails ,getTravelDetails} from "../controllers/travelController.js";


const travelRoute = Router()



travelRoute.post('/traveldetails', isLoggedIn, travelDetails)
travelRoute.get('/getTraveldetails', isLoggedIn,getTravelDetails)











export default travelRoute;
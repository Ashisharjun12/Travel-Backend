import { Router } from "express";
import { getSubscription } from "../controllers/subscriptionController.js";


const subscriptionRouter = Router()



//define router
subscriptionRouter.post('/getSubscription', getSubscription)





export default subscriptionRouter;
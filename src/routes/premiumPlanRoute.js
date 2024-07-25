import { Router } from "express";
import { advancePlan, basicPlan } from "../controllers/premiumPlanController.js";

const premiumPlanRouter = Router()


//define Routes

premiumPlanRouter.post('/basic', basicPlan)
premiumPlanRouter.post('/advance' ,advancePlan )





export default premiumPlanRouter;
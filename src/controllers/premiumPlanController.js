


const basicPlan = async(req,res,next)=>{

    res.json({success:true , msg:"msg fromm basic plan...."})
}


const advancePlan = async(req,res,next)=>{
    res.json({success:true , msg:"msg fromm premium plan...."})
}


export {basicPlan , advancePlan}
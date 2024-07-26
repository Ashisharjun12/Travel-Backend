import mongoose from "mongoose";


const subscriptionSchema =new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    plan:{
        type:String,
        required:true
    },
    start_date:{
        type:Date,
        required:true
    },
    end_date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    }
})

const subscriptionModel  = new mongoose.model('subscription', subscriptionSchema)

export default subscriptionModel;


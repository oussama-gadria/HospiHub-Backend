const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const NotificationSchema=new mongoose.Schema({
    Title:String,
    Date:Date,
    Content:String,
    Doctor:{
        type:Schema.Types.ObjectId,
        ref:"Doctor"
    },
    Patient:{
        type:Schema.Types.ObjectId,
        ref:"Patient"
    }
});

const Notification=mongoose.model("Notification",NotificationSchema);
module.exports=Notification;
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const messageModel=new mongoose.Schema({
sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
content:{ 
    type:String, 
    trim:true
},
chat:{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:"Chat"
}
})
const Message = mongoose.model('Message', messageModel);
module.exports=Message;
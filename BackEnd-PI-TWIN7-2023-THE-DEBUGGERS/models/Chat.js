const mongoose=require("mongoose");
const User = require("./User");
const Schema=mongoose.Schema;

const ChatSchema=new mongoose.Schema({
 chatName:{type:String ,trim:true},
 users:[{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:"User" ,
 }],
 latestMessage:{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:"Message",
},
groupAdmin:{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports=Chat;
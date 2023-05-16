const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const asyncHandler=require("express-async-handler");
const sendMessage=asyncHandler(async(req,res)=>{ 
    const {content,chatId,userConnectedId}=req.body;
    if (!content||!chatId||!userConnectedId){ 
        console.log("Invalid data passed into request"); 
        return res.sendStatus(400);
    }
    var newMessage={ 
        sender:userConnectedId,
        content:content,
        chat:chatId
    }; 
    try{ 
      var message=await Message.create(newMessage); 
      message=await message.populate("sender"); 
      message=await message.populate("chat");
      message=await User.populate(message,{ 
        path:"chat.users",
        select:"userName",
      });
      await Chat.findByIdAndUpdate(req.body.chatId,{ 
       latestMessage:message,
      })
      res.json(message)
    }catch(error){ 
       res.status(400).json(error.message)
    }
})
const allMessages=asyncHandler(async(req,res)=>{ 
    try{ 
     const messages=await Message.find({chat:req.params.chatId}) 
     .populate("sender") 
     .populate("chat")
     res.json(messages)
    }catch(error){ 
        res.status(400).json(error.message)
    }
})
module.exports={sendMessage,allMessages};
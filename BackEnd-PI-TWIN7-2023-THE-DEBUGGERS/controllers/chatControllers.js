const asyncHandler=require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const accessChat=asyncHandler(async(req,res)=>{ 
 const userId=req.body.userId;
 const userConnectedId=req.body.userConnectedId; 
 
 if (!userId){ 
    console.log("UserId param not sent with request"); 
    return res.sendStatus(400); 
} 
//here we will test if there is a chat in the past between those 2 users ,if yes we populate this chat else we create a new one 

var isChat= await Chat.find({ 
    //here we test if there is a chat ho has the two id of users 
    $and:[ 
     
        {users:{$elemMatch:{$eq:userConnectedId}}}, // current user 
        {users:{$elemMatch:{$eq:userId}}} //user ho will be invited to the chat 
    ]
}).populate("users").populate("latestMessage");
isChat= await User.populate(isChat,{ 
    path:"latestMessage.sender", 
    select:"userName"
})
if (isChat.length>0){ 
    res.send(isChat[0]);
}else{
     var chatData={ 
        chatName:"sender", 
        users:[userConnectedId,userId]
     }
     try { 
         const createdChat=await Chat.create(chatData);
         const FullChat=await Chat.findOne({_id:createdChat._id}).populate(
            "users"
         )
         res.status(200).send(FullChat)
     }catch(error){ 
      res.status(500)
     }
}
})


const fetchChats=asyncHandler(async (req,res)=>{ 
    try{ 
        const userConnectedId=req.body.userConnectedId; 
        Chat.find({users:{$elemMatch:{$eq:userConnectedId}}})
        .populate("users")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async (results)=>{ 
            results=await User.populate(results,{
                path:"latestMessage", 
                select:"userName"
            })
            res.status(200).send(results)
        })
       

    }catch(error){ 
      res.status(500).json(error.message)
    }
})
const getCurrentChat = asyncHandler(async (req, res) => {
    try {
      const userConnectedId = req.body.userConnectedId;
      const userReceivedId = req.body.userReceivedId;
      Chat.find({
          users: {
            $all: [userConnectedId, userReceivedId]
          }
        })
        .populate({
          path: 'users',
          select: '_id'
        })
        .populate("latestMessage", "userName")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(500).json(error.message);
    }
  });

module.exports={accessChat ,fetchChats,getCurrentChat};
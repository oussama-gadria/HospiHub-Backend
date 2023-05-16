const messageControlleur =require('../controllers/messageControlleur');
const express=require("express"); 
const router=express.Router();
router.post("/sendMessage",messageControlleur.sendMessage); 
router.get("/:chatId",messageControlleur.allMessages)
module.exports = router;
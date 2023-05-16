const express=require("express") ;
const { accessChat,fetchChats ,getCurrentChat} = require("../controllers/chatControllers");
const router=express.Router(); 
router.post('/',accessChat);
router.post('/getChat',getCurrentChat);
router.get('/',fetchChats);
module.exports = router;
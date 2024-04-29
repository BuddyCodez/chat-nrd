const { addMessage, getMessages, deleteMessage, updateMessage} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/deletemsg/", deleteMessage);
router.post("/editmsg/", updateMessage);

module.exports = router;

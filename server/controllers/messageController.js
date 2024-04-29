const Messages = require("../models/messageModel");
const { encrypt, decrypt } = require("../security");
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: decrypt(msg.message.text),
        id: msg._id,
      };
    });
    // console.log(projectedMessages);
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    let { from, to, message } = req.body;
    message = encrypt(message);
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { id,message } = req.body;
    
    const data = await Messages.findByIdAndDelete(id);
    // console.log(`Req for Message delete ${message} data: ${data}`);
    if (data) return res.json({ msg: "Message deleted successfully." });
    else return res.json({ msg: "Failed to delete message from the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateMessage = async (req, res, next) => {
  try {
    const {  id, message, from, to } = req.body;
    console.log(req.body);
    // update the message using id.
    // const getm = await Messages.findOne({_id: id});

    const data = await Messages.findByIdAndUpdate(id, {
      message: { text: encrypt(message) },
      users: [from, to],
      sender: from,
      updatedAt: new Date(),
      // createdAt: getm.createdAt,
      // __v: getm.__v,
    });
    // console.log(`Req for Message update ${message} data: ${data}`);
    if (data) return res.json({ msg: "Message updated successfully." });
    else return res.json({ msg: "Failed to update message in the database" });
  } catch (ex) {
    next(ex);
  }
};

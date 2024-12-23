const Message = require('../models/message');
const Chat = require('../models/chat');

exports.createMessage = async (req, res)=>{
    try {
        // storing  a new message  in message collection 
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        // updating the last message in chats collection  
        const updatedChat = await Chat.findOneAndUpdate({
            _id:req.body.chatId
        },{
           lastMessage:savedMessage._id,
           $inc:{unreadMessageCount:1} 
        })
         res.status(201).json({
            status:"success",
            message:"message created successfully ",
            data: savedMessage
        })
        
       } catch (error) {
        res.status(400).json({
            status:"failled",
            message:"message does not created"
        })
       }
}

exports.getAllMessages = async(req, res)=>{
    try {
        const allMessages = await Message.find({chatId: req.params.chatId})
                                             .sort({createdAt:1})
                                           
        res.status(200).json({
        status:"success",
        message:"message fetched successfully ",
        data: allMessages
        })
    } catch (error) {
        res.status(400).json({
            status:"failled",
            message:"message does not get"
        })
    }
}
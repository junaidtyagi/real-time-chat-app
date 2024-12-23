const Chat = require('../models/chat');
const Message = require('../models/message');

exports.createChat =async(req, res)=>{
   try {
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();
    await savedChat.populate('members');
     res.status(201).json({
        status:"success",
        message:"chat created successfully ",
        data: savedChat
    })
    
   } catch (error) {
    res.status(400).json({
        status:"failled",
        message:"chat does not created"
    })
   }
}
exports.getAllChat = async(req, res)=>{
    try {
     
     const allChats = await Chat.find({members: {$in :req.body.userId}})
                                .populate('members')
                                .populate('lastMessage').sort({updatedAt:-1});
      
        res.status(200).json({
         status:"success",
         message:"all chats fetched successfully ",
         data: allChats 
     })
     
    } catch (error) {
     res.status(400).json({
         status:"failled",
         message:"chat does not found"
     })
    }
 }
exports.messageCountController= async(req,res)=>{
    try {
        const chatId = req.body.chatId;
        const chat = await Chat.findById(chatId);
        if(!chat){
            res.json({
                status:"Failled",
                message:"chat does not found for given id"
            })
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {unreadMessageCount : 0},
            {new : true}
        ).populate('members').populate('lastMessage');

        await Message.updateMany({chatId:chatId, read:false},{read:true});
        res.status(200).json({
            status:"success",
            message:"Unread Message cleared successfully ",
            data: updatedChat
        })
    } catch (error) {
        res.json({
            status:"failled",
            message:"chat does not find"
        })
    }

}
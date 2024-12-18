import { axiosInstanse } from "."

export const  createChat = async(members)=>{
    try {
        const response = await axiosInstanse.post('http://localhost:3000/api/chat/create-chat' , {members});
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
export const  getAllChats = async()=>{
    try {
        const response = await axiosInstanse.get('http://localhost:3000/api/chat/');
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
export const  clearUnreadMessageCount = async(chatId)=>{
    try {
        const response = await axiosInstanse.post('http://localhost:3000/api/chat/unread-messages' , {chatId:chatId});
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
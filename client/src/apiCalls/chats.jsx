import { axiosInstanse , url } from "."

export const  createChat = async(members)=>{
    try {
        const response = await axiosInstanse.post(url + '/api/chat/create-chat' , {members});
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
export const  getAllChats = async()=>{
    try {
        const response = await axiosInstanse.get(url + '/api/chat/');
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
export const  clearUnreadMessageCount = async(chatId)=>{
    try {
        const response = await axiosInstanse.post(url + '/api/chat/unread-messages' , {chatId:chatId});
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
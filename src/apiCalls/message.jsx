import { axiosInstanse } from "./index";
export const  createNewMessage = async(message)=>{
    try {
        const response = await axiosInstanse.post('http://localhost:3000/api/message/new-message' , message);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
export const  getAllMessages = async(chatId)=>{
    try {
        const response = await axiosInstanse.get(`http://localhost:3000/api/message/${chatId}`);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
import { axiosInstanse ,url} from "./index";

export const  createNewMessage = async(message)=>{
    try {
        const response = await axiosInstanse.post( url + '/api/message/new-message' , message);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
export const  getAllMessages = async(chatId)=>{
    try {
        const response = await axiosInstanse.get( url + `/api/message/${chatId}`);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
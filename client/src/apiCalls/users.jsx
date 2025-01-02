import { axiosInstanse, url } from "./index";


export const loggedUser = async ()=>{
    try {
       const response = await axiosInstanse.get( url + '/api/user/get-user');
       return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getAllUsers = async ()=>{
    try {
       const response = await axiosInstanse.get(url + '/api/user/get-all-users');
       return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const uploadProfilePic = async (image)=>{
    try {
       const response = await axiosInstanse.post(url +'/api/user/profile-pic-upload',{image});
       return response.data;
    } catch (error) {
        console.log(error);
    }
}
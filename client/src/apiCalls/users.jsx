import { axiosInstanse } from "./index";


export const loggedUser = async ()=>{
    try {
       const response = await axiosInstanse.get('http://localhost:3000/api/user/get-user');
       return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getAllUsers = async ()=>{
    try {
       const response = await axiosInstanse.get('http://localhost:3000/api/user/get-all-users');
       return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const uploadProfilePic = async (image)=>{
    try {
       const response = await axiosInstanse.post('http://localhost:3000/api/user/profile-pic-upload',{image});
       return response.data;
    } catch (error) {
        console.log(error);
    }
}
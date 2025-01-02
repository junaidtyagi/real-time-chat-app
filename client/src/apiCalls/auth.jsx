import { axiosInstanse , url } from "./index";


export const signupUser = async (user)=>{
    try {
        const response = await axiosInstanse.post( url + '/api/auth/signup', user);
        return response.data ;
    } catch (error) {
        alert(error)
    }
}

export const loginUser = async (user)=>{
    try {
        const response = await axiosInstanse.post( url + '/api/auth/login', user);
        return response.data ;
    } catch (error) {
        alert(error)
    }
}
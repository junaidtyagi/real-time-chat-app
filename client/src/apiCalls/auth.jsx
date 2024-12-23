import { axiosInstanse } from "./index";


export const signupUser = async (user)=>{
    try {
        const response = await axiosInstanse.post('http://localhost:3000/api/auth/signup', user);
        return response.data ;
    } catch (error) {
        alert(error)
    }
}

export const loginUser = async (user)=>{
    try {
        const response = await axiosInstanse.post('http://localhost:3000/api/auth/login', user);
        return response.data ;
    } catch (error) {
        alert(error)
    }
}
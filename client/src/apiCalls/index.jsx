import axios from 'axios'
export const url = 'https://real-time-chat-app-server-g69x.onrender.com';

export const axiosInstanse = axios.create({
    headers :{
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})
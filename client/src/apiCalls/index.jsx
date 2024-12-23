import axios from 'axios'

export const axiosInstanse = axios.create({
    headers :{
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})
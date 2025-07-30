import axios from 'axios';
import API from "../config/config.js";

export const createUser =  async (address_mail)=> {
    try{
        console.log(`${API}/create`);
        const response = await axios.post(`${API}/create`, address_mail)
        return response.data;
    }catch(error){
        console.log('Error al crear el usuario', error);
        throw error
    }
}
export const loggearUser = async (address_mail) =>{
    try{
        const response = await axios.post(`${API}/login`, address_mail,
            {withCredentials: true})
        return response.data
    }catch(error){
        console.log('Error al loggear el usuario', error.response?.data || error.message);
    }
}
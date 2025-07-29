import axios from 'axios';

const API_URL_CREATE = 'http://localhost:3000/user/create'
const API_URL_LOGIN = 'http://localhost:3000/user/login'

export const createUser =  async (address_mail)=> {
    try{
        const response = await axios.post(`${API_URL_CREATE}`, address_mail)
        return response.data;
    }catch(error){
        console.log('Error al crear el usuario', error);
        throw error
    }
}
export const loggearUser = async (address_mail) =>{
    try{
        const response = await axios.post(`${API_URL_LOGIN}`, address_mail,
            {withCredentials: true})
        return response.data
    }catch(error){
        console.log('Error al loggear el usuario', error.response?.data || error.message);
    }
}
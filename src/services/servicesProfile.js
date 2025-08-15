import axios  from 'axios';
import API from "../config/config.js";
import getAuthHeaders from '../utils/tokenInLs.js';

export const getUser = async()=> {
    try{
        const response = await axios.get(`${API}/profile`,{
            withCredentials: true,
            headers: {
                ...getAuthHeaders()
            }
        });
        return response
    }catch(error){
        if(error.response){
            console.error('Error desde el backend:', error.response.data.message);
            console.error('Detalles:', error.response.data.details);
        } else if (error.request) {
           
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
        }
}

export const editUser = async(address_mail, user, password, currentPassword) => {
    try {
        const response = await axios.put(`${API}/profile`, {
            address_mail, 
            user, 
            password,
            currentPassword
        }, {
            withCredentials: true,
            headers: {
                ...getAuthHeaders()
            }
        });
        return {
            success: true,
            data: response.data 
          };
    } catch(error) {
        if (error.response) {
            console.error('Error desde el backend:', error.response.data.message);
            console.error('Detalles:', error.response.data.details);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
        throw error; 
    }
};


export const userDelete = async(currentPassword) =>{
    try{
        const response = await axios.delete(`${API}/profile`, {
            withCredentials: true,
            headers: {
                ...getAuthHeaders()
            },
            data: {
                currentPassword
            }
        })
        return response
    }catch(error){
        if (error.response) {
            console.error('Error desde el backend:', error.response.data.message);
            console.error('Detalles:', error.response.data.details);
          } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
          } else {
            console.error('Error al configurar la solicitud:', error.message);
          }
    }
}
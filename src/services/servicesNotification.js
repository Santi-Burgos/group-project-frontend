import axios from "axios";
import API from "../config/config.js";
import getAuthHeaders from '../utils/tokenInLs.js';

export const notification = async () =>{
    try{
        const response = await axios.get(`${API}/notification`, {
            withCredentials: true,
            headers: {
                ...getAuthHeaders()
            }
        });
        console.log('Datos recibidos:', response.data)
        return response.data
    } catch (error){
        if(error.response) {
            console.error('Error desde el backend:', error.response.data.messsage);
            console.error('Detalles:', error.response.data.details);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
    }
}


export const sendInvitation = async({groupID, address_mail})=>{
    try{
        const response = await axios.post(`${API}/main`,
            {groupID,
            address_mail},
           {
            withCredentials: true,
            headers: {
                ...getAuthHeaders()
            }
        });
        return {
            success: true,
            data: response.data
        };
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


export const acceptedNotification = async(groupID)=>{
    try{
        const response = await axios.post(`${API}/notification`,
            {groupID},
            {
                withCredentials: true,
                headers: {
                ...getAuthHeaders()
                }
            });
        return response
    } catch(error){
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

export const declineNotification = async(groupID)=>{
    try{
        const response = await axios.delete(`${API}/notification`,
            {
                data: { groupID },
                withCredentials: true,
                headers: {
                ...getAuthHeaders()
                }
            });
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
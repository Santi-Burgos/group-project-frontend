import axios from "axios";

const API_URL_NOTIFICATION = 'http://localhost:3000/user/notification'

export const notification = async () =>{
    try{
        const response = await axios.get(API_URL_NOTIFICATION, {withCredentials: true});
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
        const response = await axios.post('http://localhost:3000/user/main',
            {groupID,
            address_mail},
           {withCredentials: true
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
        const response = await axios.post(API_URL_NOTIFICATION,
            {groupID},
            {withCredentials: true});
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
        const response = await axios.delete(API_URL_NOTIFICATION,
            {
                data: { groupID },
                withCredentials: true
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
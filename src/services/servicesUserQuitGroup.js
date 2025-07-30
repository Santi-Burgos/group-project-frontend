import axios from "axios";
import { config as configDotenv } from 'dotenv';

configDotenv();

export const userQuitGroup = async (groupID) =>{
    try{
        const response = await axios.delete(`${API}/main`, {
            data: {groupID}, 
            withCredentials: true
    });
    return response;
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
import axios from "axios";
import API from "../config/config.js";
import getAuthHeaders from '../utils/tokenInLs.js'

export const getMessages = async (groupId)=>{
        try {
            const response = await axios.get(`${API}/msg-group?groupID=${groupId}`, { 
                withCredentials: true,
                headers: { 
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                 }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Error al obtener los mensajes:", error);
        }
    };
    

export const sendMessage = async(groupID, msg_body)=>{
    try{ 
        const response = await axios.post(`${API}/msg-group`, { groupID, msg_body },
             { 
                withCredentials: true,
                headers: { 
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                }});
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
import axios from "axios";

const API_URL = "http://localhost:3000/user/msg-group"

export const getMessages = async (groupId)=>{
        try {
            const response = await axios.get(`${API_URL}?groupID=${groupId}`, { 
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error("❌ Error al obtener los mensajes:", error);
        }
    };
    

export const sendMessage = async(groupID, msg_body)=>{
    try{ 
        const response = await axios.post(API_URL, { groupID, msg_body },
             { 
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }});
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
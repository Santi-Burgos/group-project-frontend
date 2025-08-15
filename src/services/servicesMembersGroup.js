import axios from "axios";
import API from "../config/config.js";
import getAuthHeaders from "../utils/tokenInLs.js";

export const getMembers  = async(groupID)=>{
    try{
        const response = await axios.get(`${API}/group/members?groupID=${groupID}`,
          {
            withCredentials: true,
            headers: {
                ...getAuthHeaders()
            }
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

export const deleteMember = async(groupID, userID) =>{
    try{
        const response = await axios.delete(`${API}/group/members`, {
            withCredentials: true,
            headers: {
                ...getAuthHeaders()
            },
            data: {
              groupID,
              memberDelete: userID, 
            },
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


export const editRolMember = async(userID, groupID, id_rol) =>{
    try{
        const response = await axios.put(
            `${API}/group/members`,
            {
              groupID,
              editMember: userID,
              id_rol,
            },
            {
              withCredentials: true,
              headers: {
                ...getAuthHeaders()
              }
            }
          );
          return response;
        } catch (error) {
          if (error.response) {
            console.error('Error desde el backend:', error.response.data.message);
            console.error('Detalles:', error.response.data.details);
          } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
          } else {
            console.error('Error al configurar la solicitud:', error.message);
          }
        }
      };
      
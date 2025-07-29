import axios from "axios";

const API_URL_GROUPMEMBER = 'http://localhost:3000/user/group/members';

export const getMembers  = async(groupID)=>{
    try{
        const response = await axios.get(`${API_URL_GROUPMEMBER}?groupID=${groupID}`,{
            withCredentials: true});
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
        const response = await axios.delete(API_URL_GROUPMEMBER, {
            withCredentials: true,
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
            API_URL_GROUPMEMBER,
            {
              groupID,
              editMember: userID,
              id_rol,
            },
            {
              withCredentials: true,
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
      
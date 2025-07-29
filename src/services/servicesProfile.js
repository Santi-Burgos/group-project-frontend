import axios  from 'axios';

const API_URL_PROFILEUSER = 'http://localhost:3000/user/profile ';

export const getUser = async()=> {
    try{
        const response = await axios.get(API_URL_PROFILEUSER,{
            withCredentials: true
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
        const response = await axios.put(API_URL_PROFILEUSER, {
            address_mail, 
            user, 
            password,
            currentPassword
        }, {
            withCredentials: true
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
        const response = await axios.delete(API_URL_PROFILEUSER, {
            withCredentials: true,
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
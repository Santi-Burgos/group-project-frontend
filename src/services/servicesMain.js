import axios from 'axios';

const API_URL_MAIN = 'http://localhost:3000/user/main';

export const main = async () => {
    try {
        const response = await axios.get(API_URL_MAIN, { withCredentials: true });
        console.log('Datos recibidos:', response.data);
        if (!response.data) {
            return null; 
          }
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error desde el backend:', error.response.data.message);
            console.error('Detalles:', error.response.data.details);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
        return null;
    }
};



import axios from "axios";
import { config as configDotenv } from 'dotenv';

configDotenv();

const API_URL = "http://localhost:3000/user/creategroup";

export const createGroup = async (groupData) => {
  const formData = new FormData();
  formData.append("group_name", groupData.group_name);
  formData.append("group_description", groupData.group_description);
  if (groupData.address_mail) { 
    formData.append("address_mail", groupData.address_mail);
  }
  if(groupData.group_img instanceof File){
    formData.append("group_img", groupData.group_img);
  }

  try {
    const response = await axios.post(`${API}/creategroup`, formData, {
      withCredentials: true, 
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Error en createGroup:", error.response?.data || error.message);
    throw error;
  }
};

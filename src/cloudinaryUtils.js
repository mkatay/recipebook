import axios from "axios";

const API_URL = "http://localhost:5000/api";

// feltöltés
export const uploadImage = async (file) => {
  try {
    const base64 = await convertToBase64(file);
    const res = await axios.post(API_URL+"/upload", { image: base64 });
    return res.data; // { msg, url, public_id }
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
};


// törlés
export const deleteImage = async (public_id) => {
  try {
    await axios.post(`${API_URL}/delete-image`, { public_id });
  } catch (err) {
    console.log("a fotó törlése nem sikerült...",err);
    
  }
};

// utils/convertToBase64.js
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

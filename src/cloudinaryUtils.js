import axios from "axios";
import imageCompression from "browser-image-compression";

const API_URL = "http://localhost:5000/api";

// feltöltés
export const uploadImage = async (file) => {
  try {
    const compressed = await imageCompression(file, {
        maxSizeMB: 1,maxWidthOrHeight: 800, useWebWorker: true})
    const base64 = await convertToBase64(compressed);
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
    const resp=await axios.post(`${API_URL}/delete-image`, { public_id });
     console.log("RESP FROM SERVER:", resp.data);  
    return resp.data
  } catch (err) {
    console.log("a fotó törlése nem sikerült...",err);
    return { msg: "Kép törlése sikertelen" };   
  }
};

// utils/convertToBase64.js
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();//Létrehozunk egy FileReader objektumot, amelyet a böngésző biztosít fájlok olvasásához.
    reader.readAsDataURL(file);//A fájlt Data URL-ként olvassa be.
    reader.onload = () => resolve(reader.result);//Ha sikeresen beolvassa, meghívja a Promise resolve()-ját.A reader.result tartalmazza a Base64-es Data URL-t.
    reader.onerror = (error) => reject(error);//Ha hiba történik (pl. sérült fájl), a Promise reject()-ja hívódik meg.
  });
};

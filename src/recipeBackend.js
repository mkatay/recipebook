import { db } from "./firebaseApp";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import imageCompression from "browser-image-compression";
import axios from "axios";
const apiKey = import.meta.env.VITE_IMGBB_KEY;

// 🔹 RECIPE CRUD 🔹

// R: Realtime olvasás
export const readRecipes = (setRecipes) => {
  const collectionRef = collection(db, "recipes");
  const q = query(collectionRef, orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    setRecipes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  });
  return unsubscribe;
};
/***********************************ImgBB******************* */
export const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`,formData);
      const { url, delete_url } = res.data.data;
      return { url, delete_url };
      //return res.data.data.url;
    } catch (error) {
       console.error("Kép feltöltési hiba:", error);
       throw new Error("Kép feltöltése sikertelen.");
    }
  };

// C: Új recept hozzáadása képfeltöltéssel
export const addRecipe = async (recipe, file) => {
  try {
    let imageUrl = "";
    let deleteUrl=""
    if (file) {
      //Kép kicsinyítése (max 800px)
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      const uploadResult = await uploadToImgBB(compressed);
      if (uploadResult) {
        imageUrl = uploadResult.url;
        deleteUrl = uploadResult.delete_url;
        console.log('foto urlek:',imageUrl,deleteUrl);
        
      }
    }
    const collectionRef = collection(db, "recipes");
    await addDoc(collectionRef, {
      ...recipe,
      imageUrl,
      deleteUrl,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Hiba a recept mentésekor:", err);
  }
};

  export const deleteRecipe = async (id,deleteUrl) => {
    await axios.get(deleteUrl);
    await deleteDoc(doc(db, "recipes", id));
};

// U: Recept módosítása
export const updateRecipe = async (id, updatedData, file) => {
  try {
    let imageUrl = updatedData.imageUrl || "";
    let deleteUrl = updatedData.deleteUrl || "";

    // Ha új képet tölt fel
    if (file) {
      const compressed = await imageCompression(file, { maxWidthOrHeight: 800, useWebWorker: true });
      const { url, delete_url } = await uploadToImgBB(compressed);
      imageUrl = url;
      deleteUrl = delete_url;
    }

    const docRef = doc(db, "recipes", id);
    await updateDoc(docRef, {
      ...updatedData,
      imageUrl,
      deleteUrl,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Hiba a recept frissítésekor:", err);
  }
};



// 🔍 Egy recept lekérése ID alapján
export const readRecipeById = async (id, setRecipe) => {
  try {
    const docRef = doc(db, "recipes", id);
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      // 🔹 Hozzáadjuk az id-t is az adatokhoz
      setRecipe({ id: snap.id, ...snap.data() });
      console.log(snap.data());
      
    } else {
      console.warn("A keresett recept nem található.");
      setRecipe(null);
    }
  } catch (error) {
    console.error("Hiba a recept lekérésekor:", error);
    setRecipe(null);
  }
};

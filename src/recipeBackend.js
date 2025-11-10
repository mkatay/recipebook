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
  getDoc,
} from "firebase/firestore";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { deleteImage, uploadImage } from "./cloudinaryUtils";
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
// G: Egyszeri olvasás (getDocs)
export const readRecipesOnce = async (setRecipes) => {
  const collectionRef = collection(db, "recipes");
  const q = query(collectionRef, orderBy("timestamp", "desc"));
  
  try {
    const snapshot = await getDocs(q);
    const recipes = snapshot.docs.map((doc) => ({...doc.data(),id: doc.id}));
    setRecipes(recipes);
  } catch (error) {
    console.error("Error reading recipes:", error);
  }
};

/***********************************ImgBB******************* */
/*export const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData
    );
    const { url, delete_url } = res.data.data;
    return { url, delete_url };
  } catch (error) {
    console.error("Kép feltöltési hiba:", error);
    throw new Error("Kép feltöltése sikertelen.");
  }
};
*/
// C: Új recept hozzáadása képfeltöltéssel
export const addRecipe = async (recipe, file) => {
  try {
    let imageUrl = "";
    let deleteUrl = "";
    if (file) {
      //Kép kicsinyítése:
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      const uploadResult = await uploadImage(compressed)
      if (uploadResult) {
        imageUrl = uploadResult.url;
        deleteUrl = uploadResult.public_id;
        console.log("foto urlek:", imageUrl, deleteUrl);
      }
    }
    const collectionRef = collection(db, "recipes");
    await addDoc(collectionRef, {...recipe,imageUrl, deleteUrl,timestamp: serverTimestamp() });  
  } catch (err) {
    console.error("Hiba a recept mentésekor:", err);
  }
};
//recept törlése:
export const deleteRecipe = async (id, deleteUrl, setServerMsg) => {
  try {
    await deleteImage(deleteUrl,setServerMsg)
    await deleteDoc(doc(db, "recipes", id));
  
    
  } catch (error) {
    console.error("Hiba a törlésnél:", error);
    setServerMsg("Hiba a törlésnél!");
  }
};


////////////////////// U: Recept módosítása
export const updateRecipe = async (id, updatedData, file,oldPhotoUrl) => {
  try {
    let imageUrl = updatedData.imageUrl || "";
    let deleteUrl = updatedData.deleteUrl || "";

    // Ha új képet tölt fel
    if (file) {
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      //kitöröljük a régit:
      console.log("Törléshez használt deleteUrl (public_id?):", deleteUrl);
      await deleteImage(oldPhotoUrl)
      const uploadResult = await uploadImage(compressed)
      if (uploadResult) {
        imageUrl = uploadResult.url;
        deleteUrl = uploadResult.public_id;
        console.log("foto urlek:", imageUrl, deleteUrl);
      }
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

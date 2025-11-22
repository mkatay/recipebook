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
  setDoc,
} from "firebase/firestore";
import imageCompression from "browser-image-compression";
import { deleteImage, uploadImage } from "./cloudinaryUtils";
import axios from "axios";
//const apiKey = import.meta.env.VITE_IMGBB_KEY;

// 🔹 RECIPE CRUD 🔹

// R: Realtime olvasás
export const readRecipes = (setRecipes,setLoading) => {
  const collectionRef = collection(db, "recipes");
  const q = query(collectionRef, orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    setRecipes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false)
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
    const uploadResult = await uploadImage(file)
    if (uploadResult) {
        imageUrl = uploadResult.url;
        deleteUrl = uploadResult.public_id;
        console.log("foto urlek:", imageUrl, deleteUrl);
      }
    const collectionRef = collection(db, "recipes");
    await addDoc(collectionRef, {...recipe,imageUrl, deleteUrl,timestamp: serverTimestamp() });  
  } catch (err) {
    console.error("Hiba a recept mentésekor:", err);
  }
};
//recept törlése:
export const deleteRecipe = async (id, deleteUrl, setMsg) => {
  try {
   const resultFromServer= await deleteImage(deleteUrl)
   console.log(resultFromServer);
    console.log(resultFromServer.msg);
   setMsg({serverMsg:resultFromServer.msg})
   await deleteDoc(doc(db, "recipes", id));
  } catch (error) {
    console.error("Hiba a törlésnél:", error);
    setMsg({msg:"Hiba a törlésnél!"});
  }
};


////////////////////// U: Recept módosítása
export const updateRecipe = async (id, updatedData, file,oldPhotoUrl) => {
  try {
    let imageUrl = updatedData.imageUrl || "";
    let deleteUrl = updatedData.deleteUrl || "";
      //kitöröljük a régit:
      console.log("Törléshez használt deleteUrl (public_id?):", deleteUrl);
      await deleteImage(oldPhotoUrl)
      const uploadResult = await uploadImage(file)
      if (uploadResult) {
        imageUrl = uploadResult.url;
        deleteUrl = uploadResult.public_id;
        console.log("foto urlek:", imageUrl, deleteUrl);
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


export const updateAvatar = async (uid, public_id) => {
  let oldPublicId=null
  try {
    const docRef = doc(db, "avatars", uid);
    const docSnap = await getDoc(docRef);
    // Ha nincs dokumentum → új készítése
    if (!docSnap.exists()) {
      await setDoc(docRef, {uid,public_id});
    }else{
      oldPublicId = docSnap.data().public_id;
      await updateDoc(docRef, {public_id});
    }
    if(oldPublicId) await deleteImage(oldPublicId)
  } catch (error) {
    console.error("Avatar frissítési hiba:", error);
    throw error;
  }
};
export const deleteAvatar = async (uid) => {
  let publicId=null
  try {
    const docRef = doc(db, "avatars", uid);
    const docSnap = await getDoc(docRef);
    // Ha nincs dokumentum nincs teendő
    if (!docSnap.exists()) {
      return
    }else{
      publicId = docSnap.data().public_id;
      await deleteDoc(docRef)
      await deleteImage(publicId)
    }
  } catch (error) {
    console.error("Avatar törlési hiba:", error);
    throw error;
  }
};

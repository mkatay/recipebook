import { db, storage } from "./firebaseApp";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from "browser-image-compression";

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

// C: Új recept hozzáadása képfeltöltéssel
export const addRecipe = async (recipe, file) => {
  try {
    let imageUrl = "";

    if (file) {
      // 1️⃣ Kép kicsinyítése (max 800px)
      const compressed = await imageCompression(file, {
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      // 2️⃣ Feltöltés Storage-be
      const storageRef = ref(storage, `recipes/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressed);

      // 3️⃣ Letöltési URL
      imageUrl = await getDownloadURL(storageRef);
    }

    // 4️⃣ Recept mentése Firestore-ba
    const collectionRef = collection(db, "recipes");
    await addDoc(collectionRef, {
      ...recipe,
      imageUrl,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Hiba a recept mentésekor:", err);
  }
};

// U: Recept módosítása
export const editRecipe = async (id, updatedFields) => {
  const docRef = doc(db, "recipes", id);
  await updateDoc(docRef, updatedFields);
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
      return null;
    }
  };

  export const deleteRecipe = async (recipe) => {
  // 1. Töröljük a képet ImgBB-ről
  if (recipe.deleteUrl) { //Ez publikus, tehát csak tanulási célra szabad használni, backenden kell a törlést megvalósítani egy valódi projektnél
    await fetch(recipe.deleteUrl);
  }
  // 2. Töröljük a receptet Firestore-ból
  await deleteDoc(doc(db, "recipes", recipe.id));
};

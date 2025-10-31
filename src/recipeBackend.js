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

// D: Recept törlése (Firestore + Storage)
export const deleteRecipe = async (id, imageUrl) => {
  try {
    // 1️⃣ Törlés Firestore-ból
    const docRef = doc(db, "recipes", id);
    await deleteDoc(docRef);

    // 2️⃣ Kép törlése Storage-ból, ha volt
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }
  } catch (err) {
    console.error("Hiba a recept törlésekor:", err);
  }
};

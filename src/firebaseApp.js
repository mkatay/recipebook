import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebaseConfig";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//Létrejön egy Firebase App példány, ami az összes szolgáltatást (auth, database, storage stb.) innen éri el.
const app = initializeApp(firebaseConfig);// a függvény elindítja a Firebase alkalmazást a te projekted beállításaival.
export const auth = getAuth(app);//Ez az objektum felelős a Google / Email / Facebook / stb. hitelesítésért.
export const provider = new GoogleAuthProvider();//a Google bejelentkezés “szolgáltatóját” hozza létre.
export const db = getFirestore(app);//Firestore adatbázis inicializálása
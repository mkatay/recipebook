import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged,signInWithEmailAndPassword,signOut,createUserWithEmailAndPassword,deleteUser,sendPasswordResetEmail,updateProfile,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential} from 'firebase/auth';
import { auth } from '../firebaseApp';
import { useNavigate } from 'react-router';
import { uploadImage } from '../cloudinaryUtils';
import { updateAvatar } from '../recipeBackend';




const urlRedirect=/*'https://kamsblog.netlify.app/auth/in' */'http://localhost:5173/auth/in'

export const MyUserContext = createContext();//létrehozunk egy "tartályt" az adatoknak

export const MyUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [msg,setMsg]=useState(null)
  const navigate=useNavigate()

  useEffect(() => {
    //Ez a Firebase Auth egyik beépített figyelője (listener).
//Azt csinálja, hogy mindig lefut, ha a felhasználó be- vagy kijelentkezik, illetve amikor az alkalmazás elindul.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  const logoutUser=async ()=>{
    await signOut(auth)    
  }

  const signInUser=async (email,password)=>{
    try{
      await signInWithEmailAndPassword(auth,email,password)  
      const currentUser=auth.currentUser
      if(!currentUser.emailVerified){
        setMsg({err: "Az email címedet nem aktiváltad!" });
        logoutUser()
        return
      }
      setMsg(null)
      setMsg({signin:true})
      navigate('/recipes')
     }catch(err){
        setMsg({err:err.message})
       } 
  }

  const signUpUser = async (email, password, displayName) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, { displayName });
    await sendEmailVerification(auth.currentUser);
    setMsg(null)
    setMsg({ signUp: "Az email címre egy aktiváló link érkezett!" });
  } catch (err) {
    setMsg({ err: err.message });
  }
};

  const updateUser =async (file) => {
    try{
      const uploadresult=await uploadImage(file)
      console.log(uploadresult);
      
      if(uploadresult.url) {
        await updateProfile(auth.currentUser, {photoURL:uploadresult.url})
        //el kell tárolni az avatar public_id-t is hogy ki lehessen törölni a Cloudinaryból
        await updateAvatar(user.uid,uploadresult.public_id)
      }
      setUser({ ...auth.currentUser }); //  Frissíti a lokális user state-et
      setMsg(null);
      setMsg({updateProfile:'Sikeres profil módosítás!'})  
    }catch(err){
        setMsg({err:err.message})
    }
  };
     
  const resetPassword = async (email) => {
  let success = false;
  try {
    await sendPasswordResetEmail(auth, email);
    setMsg(null)
    setMsg({ resetPw: 'A jelszóvisszaállítási email elküldve.' });
    success = true;
  } catch (err) {
    setMsg({ err: err.message });
  } finally {
    if (success) {
      // csak sikeres emailküldés után navigálunk
      navigate('/signin');
    }
  }
};

  const deleteAccount = async (password) => {
  try {
    const credential = EmailAuthProvider.credential(auth.currentUser.email,password);
    // kötelező reauth:újrahitelesíti a jelenlegi felhasználót a megadott jelszóval. 
    await reauthenticateWithCredential(auth.currentUser, credential);
    // ha sikeres → törlés
    await deleteUser(auth.currentUser);
    setMsg(null);
    setMsg({ serverMsg: "Felhasználói fiók törölve." });

  } catch (error) {
    console.log(error);

    if (error.code === "auth/wrong-password") {
      setMsg({ err: "Hibás jelszó!" });
    } else {
      setMsg({ err: "Hiba történt a fiók törlésekor!" });
    }
  }
};


    return (
    <MyUserContext.Provider value={{ user,msg,logoutUser,signInUser,resetPassword,setMsg,
                                  deleteAccount,signUpUser,updateUser}}>
                                     
      {children}
    </MyUserContext.Provider>
  );
};
import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged,signInWithEmailAndPassword,signOut,createUserWithEmailAndPassword,deleteUser,sendPasswordResetEmail,updateProfile,
  sendEmailVerification} from 'firebase/auth';
import { auth } from '../firebaseApp';




const urlRedirect=/*'https://kamsblog.netlify.app/auth/in' */'http://localhost:5173/auth/in'

export const MyUserContext = createContext();//létrehozunk egy "tartályt" az adatoknak

export const MyUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [msg,setMsg]=useState({})


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
    setMsg({});
  }

  const signInUser=async (email,password)=>{
    try{
      await signInWithEmailAndPassword(auth,email,password)  
      setMsg({});
      setMsg({signin:'Sikeres bejelentkezés!'})
     }catch(err){
        setMsg({err:err.message})
       } 
  }

  const signUpUser = async (email, password, displayName) => {
    console.log(email, password, displayName);
    
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, { displayName });
    await sendEmailVerification(auth.currentUser);
    setMsg({ signup: "Az email címre egy aktiváló link érkezett!" });
    logoutUser();
  } catch (err) {
    setMsg({ err: err.message });
  }
};

  const updateUser =async (displayName,photoURL) => {
    try{
      if(displayName && photoURL) await updateProfile(auth.currentUser, {displayName,photoURL})
      else if (displayName) await updateProfile(auth.currentUser, {displayName})
      else if(photoURL) await updateProfile(auth.currentUser, {photoURL})
      setMsg({});
      setMsg({update:'Sikeres módosítás!'})  
    }catch(err){
        setMsg({err:err.message})
    }
  };
     
  const resetPassword =async (email) => {
    try{
      await sendPasswordResetEmail(auth, email);
      setMsg({});
      //console.log('A jelszóvisszaállítási email elküldve.');
      setMsg({resetPw:'A jelszóvisszaállítási email elküldve.'})
    }catch(err){
      setMsg({err:err.message})

    }
  }
  const deleteAccount = async () => {
    try {
      await deleteUser(auth.currentUser);
      console.log('Felhasználói fiók törölve.');
    } catch (error) {
      console.error('Hiba történt a fiók törlésekor:', error);
    }
  };

    return (
    <MyUserContext.Provider value={{ user,msg,logoutUser,signInUser,resetPassword,setMsg,
                                  deleteAccount,signUpUser,updateUser}}>
                                     
      {children}
    </MyUserContext.Provider>
  );
};
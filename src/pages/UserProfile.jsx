import React, { useContext, useState } from 'react';
import { MyUserContext } from '../context/MyUserContext';
import { deleteAvatar } from '../recipeBackend';
//import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
//import { storage } from '../firebaseApp';

export const UserProfile = () => {
  const { user, updateUser, deleteAccount, msg } = useContext(MyUserContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
     const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(!file) return
    try {
      await updateUser(file)
    } catch (err) {
      console.error('Hiba a profil frissítés során:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Biztosan törölni szeretnéd a fiókodat?')) {
     const pw = prompt("Add meg a jelszavad a fiók törléséhez:");
     await deleteAvatar(user.uid)
     await deleteAccount(pw);
    };   
  }

  return (
    <div  style={{
      paddingTop:"5rem",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems:'center',
        flexDirection:"column",
        maxWidth:"400px",
        margin:'auto',
        gap:'10px'
      }} >
      <h2 >Profil módosítása</h2>

      {user?.photoURL && (
        <div >
            <h4>Felhasználó név: {user.displayName}</h4>
            <p>Email cím: {user.email}</p>
            <img style={{width: "80px",height:"80px",objectFit:"cover",borderRadius:"50%"}} src={user.photoURL} alt="Profilkép" />
        </div>
      )}

      <form onSubmit={handleSubmit} >
        
        <label >Új profilkép</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" disabled={loading} >
          {loading ? 'Mentés...' : 'Profil frissítése'}
        </button>
      </form>
      {preview && (
        <img src={preview} alt="Előnézet" style={{width: "80px",height:"80px",objectFit:"cover",borderRadius:"50%"}}   />
      )}

      <button style={{position:"fixed",bottom:'5px',right:'5px',backgroundColor:"red"}} onClick={handleDelete}>Fiók törlése</button>

     
    </div>
  );
};


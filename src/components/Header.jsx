// Header.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { MyUserContext } from "../context/MyUserContext";
import './Header.css'
import { RxAvatar } from "react-icons/rx";
import { FaHome } from "react-icons/fa";

const Header = () => {
  const { user, logoutUser } = useContext(MyUserContext);
  const navigate = useNavigate();
console.log(user);

  return (
    <header className="header">
    {/*  <h1 onClick={() => navigate("/")}>RecipeBook</h1>*/}

      <div className="header-right">
        <FaHome size={32} onClick={()=>navigate('/')} className='goHome'/>
        {user ? (
          <div>
            <span onClick={()=>navigate('/profile')} title={user?.displayName}>
              {user?.photoURL ? 
               <img style={{width: "30px",height:"30px",objectFit:"cover",borderRadius:"50%"}} src={user.photoURL} alt="Profilkép" />
              :
               <RxAvatar  size={30} className='avatar' />
              }
            </span>
           
            <button onClick={()=>logoutUser()}>Kijelentkezés</button>
          </div>
        ) : (
          <div>
            <button onClick={() => navigate("/signin")}>Bejelentkezés</button>
            <button onClick={() => navigate("/signup")}>Regisztráció</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

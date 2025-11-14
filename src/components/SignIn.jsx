import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { MyUserContext } from "../context/MyUserContext";
import { useEffect } from "react";

export const SignIn = () => {
  const { signInUser, msg, user,setMsg} = useContext(MyUserContext);
  const navigate = useNavigate();
console.log(msg);

  useEffect(()=>{
      setMsg({})
     },[])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    //console.log('Sign Up:', data.get('email'), data.get('password'));
    signInUser(data.get("email"), data.get("password"));
    };

  return (
    <div>
    <div
      style={{
        padding: "80px 10px 0 10px",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div>
        <h3 style={{textAlign:"center"}}>Bejelentkezés</h3>
        <form onSubmit={handleSubmit} style={{width:"100%"}}>
          <div>
            <label style={{display:"block"}}>Email</label>
            <input name="email" placeholder="email" type="email" />
          </div>
          <div>
            <label  style={{display:"block"}}>Password</label>
            <input name="password" placeholder="password " type="password" />
          </div>
          <button>Sign In</button>
        </form>
      </div>
      
    </div>
    <div style={{textAlign:'center'}}><a href="#" onClick={()=>navigate('/pwreset')}style={{color:'var(--color-accent)'}}>Elfelejtett jelszó</a></div>
 
    </div>
  );
};

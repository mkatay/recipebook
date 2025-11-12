import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { MyUserContext } from "../context/MyUserContext";
import { useEffect } from "react";
import { MyToastify } from "./MyToastify";

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
        marginTop: "2rem",
        width: "100vw",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div>
        <h3>Sign In</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input name="email" placeholder="email" type="email" />
          </div>
          <div>
            <label>Password</label>
            <input name="password" placeholder="password " type="password" />
          </div>
          <button>Sign In</button>
        </form>
      </div>
      
    </div>
    <div style={{textAlign:'center'}}><a href="#" onClick={()=>navigate('/pwreset')}style={{color:'var(--color-accent)'}}>Elfelejtett jelszó</a></div>
    {msg && <MyToastify {...msg}/>}
    </div>
  );
};

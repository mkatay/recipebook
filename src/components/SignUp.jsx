import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { MyUserContext } from "../context/MyUserContext";
import { useEffect } from "react";
import { useState } from "react";
import { MyToastify } from "./MyToastify";

export const SignUp = () => {
  const { signUpUser, msg,setMsg,logoutUser } = useContext(MyUserContext);
  const [loading,setLoading]=useState(false)
console.log(msg,loading);

   useEffect(()=>{
    setMsg({})
   },[])

  const handleSubmit =async (event) => {
    event.preventDefault();
    setLoading(true)
    const myForm=event.currentTarget//el kell tárolni a form-ot mert az onAuthStateChange() lefut ami újrarendereli az oldalt és elveszítjuk az eseményobjektumot
    try {
      const data = new FormData(myForm);
      //console.log('Sign Up:', data.get('email'), data.get('password'));
      await signUpUser(data.get("email"),data.get("password"), data.get("display_name"));
      myForm.reset()
      await logoutUser()
    } finally {
        setLoading(false)
    }
    
  };

  return (
    <div>
    <div
      style={{
        marginTop: "2rem",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div>
        <h3>Sign UP</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{display:'block'}}>Email</label>
            <input name="email" placeholder="email" type="email" />
          </div>
          <div>
            <label>Password</label>
            <input name="password" placeholder="password " type="password" />
          </div>
          <div>
            <label>Username</label>
            <input name="display_name" placeholder="username " type="text" />
          </div>
          <button disabled={loading}>{loading ? "Regisztráció folyamatban..." : "Sign UP"}</button>
        </form>
   
      </div>
    </div>
    {msg && <MyToastify {...msg}/>}
    </div>
  );
};

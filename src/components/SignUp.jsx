import React from "react";
import { useContext } from "react";
import { MyUserContext } from "../context/MyUserContext";
import { useEffect } from "react";
import { useState } from "react";

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
        padding: "80px 10px 0 10px",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div>
        <h3 style={{textAlign:"center"}}>Regisztráció</h3>
        <form onSubmit={handleSubmit} style={{width:"100%"}}>
          <div>
            <label style={{display:'block'}}>Email</label>
            <input name="email" placeholder="email" type="email" />
          </div>
          <div>
            <label style={{display:'block'}}>Password</label>
            <input name="password" placeholder="password " type="password" />
          </div>
          <div>
            <label style={{display:'block'}}>Username</label>
            <input name="display_name" placeholder="username " type="text" />
          </div>
          <button disabled={loading}>{loading ? "Regisztráció folyamatban..." : "Sign UP"}</button>
        </form>
   
      </div>
    </div>

    </div>
  );
};

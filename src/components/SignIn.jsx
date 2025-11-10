import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { MyUserContext } from "../context/MyUserContext";

export const SignIn = () => {
  const { signInUser, msg, user } = useContext(MyUserContext);

  console.log(msg, user);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    //console.log('Sign Up:', data.get('email'), data.get('password'));
    signInUser(data.get("email"), data.get("password"));
    navigate("/recipes");
  };

  return (
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
  );
};
